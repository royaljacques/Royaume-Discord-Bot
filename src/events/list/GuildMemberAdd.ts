import { ChannelType, GuildMember } from "discord.js";
import Client from "$core/Client";
import Event, { EventName } from "$core/events/Event";
import { verify, privateMode, generalChannel, tiers as configTiers } from "$resources/config/information.json";
import { createMember, CreateMemberType, CreateMemberVariables, getMemberActivityTier, GetMemberActivityTierType, GetMemberActivityTierVariables, setAlwaysOnServer } from "$core/api/requests/Member";
import { gqlRequest } from "$core/utils/Request";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";

export default class GuildMemberAdd extends Event {

    public name: EventName = "guildMemberAdd";

    public async execute(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        // Create the member if he doesn't exist :
        const result = await gqlRequest<CreateMemberType, CreateMemberVariables>(createMember, {
            id: member.id,
            username: member.user.username,
            profilePicture: member.user.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
        });

        // if (!result.data?.createMember._id) gqlRequest(setAlwaysOnServer, { id: member.id, value: true });

        // Add verification role :
        if (privateMode) {
            const role = await (await Client.instance.getGuild()).roles.fetch(verify.roles.waiting);

            if (role) member.roles.add(role);
        } else {
            const guild = await Client.instance.getGuild();
            const channel = await guild.channels.fetch(generalChannel);

            if (channel?.type === ChannelType.GuildText) {
                const ClientId: any = Client.instance.user?.id
                const embed = simpleEmbed(msg("event-guildmemberadd-welcome-message", [ClientId]));

                (await channel.send({ content: msg("event-guildmemberadd-welcome", [member.id]), embeds: [embed] })).react("👋");
            }

            const tier = await gqlRequest<GetMemberActivityTierType, GetMemberActivityTierVariables>(getMemberActivityTier, {
                memberId: member.id
            });
            
            const tiers: Record<string, string> = configTiers;

            if (tier.data?.member.activity.tier) {
                member.roles.add(tiers[tier.data?.member.activity.tier.toString()]);
            }
        }

    }
}