import { DMChannel, GuildChannel } from "discord.js";
import Event, { EventName } from "$core/events/Event";
import { getChannels, removeChannel } from "$core/api/requests/MainChannel";
import { gqlRequest } from "$core/utils/request";
import { gameGuildId } from "$resources/config/information.json";

export default class ChannelDelete extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "channelDelete";

  public async execute(channel: DMChannel | GuildChannel): Promise<void> {
    if (channel instanceof GuildChannel && channel.guildId === gameGuildId) return;

    const channelsQuery = await gqlRequest(getChannels);

    if (!channelsQuery.success) return;

    if (channelsQuery.data.channels.find(c => c.channelId === channel.id)) gqlRequest(removeChannel, { channelId: channel.id });
  }

}