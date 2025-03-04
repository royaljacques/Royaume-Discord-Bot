import Client from "$core/Client";
import Task from "$core/tasks/Task";
import { getPresenceMessages } from "$core/api/requests/PresenceMessage";
import { ActivityType } from "discord.js";
import { gqlRequest } from "$core/utils/request";

const activityType: Record<string, Exclude<ActivityType, ActivityType.Custom>> = {
  "COMPETING": ActivityType.Competing,
  "LISTENING": ActivityType.Listening,
  "PLAYING": ActivityType.Playing,
  "WATCHING": ActivityType.Watching
};

export default class PresenceUpdate extends Task {

  public readonly enabledInDev = true;

  constructor() {
    super(10_000);
  }

  public async run(): Promise<void> {
    const presenceMessagesQuery = await gqlRequest(getPresenceMessages);

    if (!presenceMessagesQuery.success) return;

    const presenceMessages = presenceMessagesQuery.data.presenceMessages;
    const message = presenceMessages[Math.floor(Math.random() * presenceMessages.length)];

    Client.instance.user?.setActivity({ name: message.text, type: activityType[message.type] });
  }

}