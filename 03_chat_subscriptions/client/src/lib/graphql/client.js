import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { getAccessToken } from '../auth';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWSClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

// const httpLink = createHttpLink({ uri: 'http://192.168.0.19:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const httpLink = concat(authLink, createHttpLink({ uri: 'http://192.168.0.19:9000/graphql' }))

const wsLink = new GraphQLWsLink(createWSClient({
  url: 'ws://192.168.0.19:9000/graphql',
  connectionParams: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      console.log("Access Token Available")
      return { authToken: accessToken, testParam: 'Test Value' };
    }
  }
}));

export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
});

function isSubscription(operation) {
  console.log("Operation: ", operation)
  // return operation.query.definitions.some(
  //   (definition) => definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  // );
  const definition = getMainDefinition(operation.query);
  return definition.kind === Kind.OPERATION_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION;
}