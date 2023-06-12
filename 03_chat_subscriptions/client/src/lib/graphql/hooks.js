import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './queries';

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const { data: { message } } = await mutate({
      variables: { text },
      // update: (cache, { data: { message } }) => {   // Updating the cache in Subscription now
      //   cache.updateQuery({query: messagesQuery}, (oldData) => {
      //     return {
      //       messages: [...oldData.messages, message],
      //     };
      //   })
      // }
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  useSubscription(messageAddedSubscription, {
    onData: ({client, data: {data: {message}}}) => {
      console.log("Socket Data: ", message)
      client.cache.updateQuery({query: messagesQuery}, (oldData) => {
        return {
          messages: [...oldData.messages, message],
        };
      })
    },      
    // onSubscriptionData: ({ client, subscriptionData }) => {
    //   client.writeQuery({
    //     query: messagesQuery,
    //     data: {
    //       messages: [...data.messages, subscriptionData.data.messageAdded],
    //       },
    //     });
    //   },
    });
  return {
    messages: data?.messages ?? [],
  };
}
