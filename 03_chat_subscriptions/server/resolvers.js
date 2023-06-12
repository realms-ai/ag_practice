import { GraphQLError } from 'graphql';
import { createMessage, getMessages } from './db/messages.js';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub()

export const resolvers = {
  Query: {
    messages: (_root, _args, { user }) => {
      if (!user) throw unauthorizedError();
      return getMessages();
    },
  },

  Mutation: {
    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = await  createMessage(user, text);
      console.log("Adding message to pubSub")
      pubSub.publish('messageAdded', { messageAdded: message });
      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_root, _args, {user}) => {
        console.log('[Subscription] User: ', user)
        if (!user) throw unauthorizedError();
        // AsyncIterator is a protocol defined by JS
        // AsyncGenerator conforms both to AsyncIterator and to AsyncIterable protocols and yield multiple values over time
        // Advanced and Complex Feature
        return pubSub.asyncIterator('messageAdded');
      },
    },
  },
};

function unauthorizedError() {
  return new GraphQLError('Not authenticated', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}
