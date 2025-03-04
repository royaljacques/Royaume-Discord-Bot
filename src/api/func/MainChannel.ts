import { getChannels } from "$core/api/requests/MainChannel";
import { gqlRequest } from "$core/utils/request";

type ChannelsByCategory = {
    [category: string]: string[]
}

export async function getChannelsByCategory(): Promise<ChannelsByCategory> {
  // Get mains channels :
  const response = await gqlRequest(getChannels);

  if (!response.success) return {};

  const channels = response.data.channels;

  // Sort channels by category :
  const channelsIdsByCategory: ChannelsByCategory = {};

  if (!channels) return channelsIdsByCategory;

  for (const channel of channels) {
    if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

    channelsIdsByCategory[channel.category].push(channel.channelId);
  }

  return channelsIdsByCategory;
}