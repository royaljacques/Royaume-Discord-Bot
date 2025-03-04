import { createMember, getMembersOnServerStatus, setAlwaysOnServer } from "$core/api/requests/Member";
import Client from "$core/Client";
import Logger from "$core/utils/Logger";
import Task from "$core/tasks/Task";
import { gqlRequest } from "$core/utils/request";

export default class VerifyMembers extends Task {

  public readonly enabledInDev = false;

  constructor() {
    super(1000 * 60 * 3);
  }

  public async run(): Promise<void> {
    const realMembers = await (await Client.instance.getGuild()).members.fetch();
    const apiMembersQuery = await gqlRequest(getMembersOnServerStatus);

    if (!apiMembersQuery.success) return;

    for (const apiMember of apiMembersQuery.data.members) {
      const realMember = realMembers.get(apiMember._id);

      if (realMember && !realMember.user.bot) {
        realMembers.delete(apiMember._id);
        continue;
      }

      // Remove members :
      Logger.info(`Fix ${apiMember._id} isOnServer value to false (${apiMember.username})`);
      gqlRequest(setAlwaysOnServer, { id: apiMember._id, value: false });
    }

    for (const realMember of realMembers.values()) {
      if (realMember.user.bot) continue;

      // Add member :
      Logger.info(`Fix ${realMember.id} isOnServer value to true (${realMember.displayName})`);

      const response = await gqlRequest(
        setAlwaysOnServer, { id: realMember.id, value: true }
      );

      if (response.success) return;

      // Create member if he does not exist :
      await gqlRequest(createMember, {
        id: realMember.id,
        username: realMember.displayName,
        profilePicture: realMember.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
      });
    }
  }

}