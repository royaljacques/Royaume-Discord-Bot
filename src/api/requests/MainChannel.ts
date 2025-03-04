import { graphql } from "$core/utils/request/graphql";

export const addChannel = graphql(`
    mutation addChannel($channelId: ID!, $category: String!){
        addChannel(channelId: $channelId, category: $category)
    }
`);

export const removeChannel = graphql(`
    mutation removeChannel($channelId: ID!){
        removeChannel(channelId: $channelId)
    }
`);

export const getChannels = graphql(`
    query getChannels {
        channels {
            channelId
            category
        }
    }
`);