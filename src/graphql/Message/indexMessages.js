import { graphql } from 'react-apollo';
import _ from 'lodash';
import ListMessages from './listMessages';
import CreateMessagesSubscription from './createMessagesSubscription';
import CreateMessage from './createMessage';
import CreateConversation from './createConversation';
import CreateUserConversations from './createUserConversations';
import ListConversations from './listConversations';
import DeleteUserConversations from './deleteUserConversations';
import DeleteConversation from './deleteConversation';
import DeleteUserConversationsSubscription from './deleteUserConversationsSubscription';
import CreateUserConversationsSubscription from './createUserConversationsSubscription';

const makeOnFetchMoreConversations = (fetchMore, nextToken, userId) => {
  if (!nextToken) {
    return null;
  }
  return () => {
    fetchMore({
      query: ListConversations,
      variables: {
        userId,
        nextToken,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          ...previousResult,
          allConversationsOfMe: {
            ...previousResult.allConversationsOfMe,
            ...fetchMoreResult.allConversationsOfMe,
            userConversations: [
              ...previousResult.allConversationsOfMe.userConversations,
              ...fetchMoreResult.allConversationsOfMe.userConversations,
            ],
          },
        };
      },
    });
  };
};

const makeOnFetchMoreMessages = (fetchMore, nextToken, conversationId) => {
  // console.log(`fetch more ${nextToken}`);
  if (!nextToken) {
    return null;
  }
  return () => {
    fetchMore({
      query: ListMessages,
      variables: {
        conversationId,
        nextToken,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          ...previousResult,
          allMessages: {
            ...previousResult.allMessages,
            ...fetchMoreResult.allMessages,
            messages: [
              ...previousResult.allMessages.messages,
              ...fetchMoreResult.allMessages.messages,
            ],
          },
        };
      },
    });
  };
};

const makeSubscribeToCreateMessages = (subscribeToMore, conversationId) => {
  // console.log('subscribe to create message');
  return subscribeToMore({
    document: CreateMessagesSubscription,
    variables: { conversationId },
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { subscribeToNewMessage },
        },
      }
    ) => {
      if (!subscribeToNewMessage) {
        // console.log('Previous result', previousResult);
        // console.log('de ce', subscribeToNewMessage);
        return previousResult;
      }
      // console.log('subscription to mess', subscribeToNewMessage);
      // console.log('prev: ', previousResult);
      return {
        ...previousResult,
        allMessages: {
          ...previousResult.allMessages,
          messages: [
            subscribeToNewMessage,
            ...previousResult.allMessages.messages.filter(
              el => el.s_key !== subscribeToNewMessage.s_key
            ),
          ],
        },
      };
    },
    onError: error => {
      console.log('errr', error);
      if (
        error.errorMessage &&
        error.errorMessage.includes('Socket') &&
        !error.errorMessage.includes('undefined')
      ) {
        setTimeout(() => {
          makeSubscribeToCreateMessages(subscribeToMore, conversationId);
        }, 100);
      }
    },
  });
};

const makeSubscribeToCreateUserConversations = (subscribeToMore, userId) => {
  // console.log('subscribe to create user conversation');
  return subscribeToMore({
    document: CreateUserConversationsSubscription,
    variables: { userId: `member_${userId}` },
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { subscribeToNewUserConversation },
        },
      }
    ) => {
      if (!subscribeToNewUserConversation) {
        // console.log('Previous result', previousResult);
        // console.log('de ce', subscribeToNewUserConversation);
        return previousResult;
      }
      // console.log('subs user conversation!!', subscribeToNewUserConversation);
      return {
        ...previousResult,
        allConversationsOfMe: {
          ...previousResult.allConversationsOfMe,
          userConversations: [
            subscribeToNewUserConversation,
            ...previousResult.allConversationsOfMe.userConversations.filter(
              conversation => conversation.s_key !== subscribeToNewUserConversation.s_key
            ),
          ],
        },
      };
    },
    onError: error => {
      if (
        error.errorMessage &&
        error.errorMessage.includes('Socket') &&
        !error.errorMessage.includes('undefined')
      ) {
        setTimeout(() => {
          makeSubscribeToCreateMessages(subscribeToMore, userId);
        }, 100);
      }
    },
  });
};

const makeSubscribeToDeleteUserConversations = (subscribeToMore, userId) => {
  // console.log('Del SUb');
  return subscribeToMore({
    document: DeleteUserConversationsSubscription,
    variables: { userId: `member_${userId}` },
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { subscribeToDeleteUserConversation },
        },
      }
    ) => {
      if (!subscribeToDeleteUserConversation) {
        // console.log('Previous result', previousResult);
        // console.log('de ce', subscribeToDeleteUserConversation);
        return previousResult;
      }
      console.log('ajunge aici!!', subscribeToDeleteUserConversation);
      return {
        ...previousResult,
        allConversationsOfMe: {
          ...previousResult.allConversationsOfMe,
          userConversations: [
            subscribeToDeleteUserConversation,
            ...previousResult.allConversationsOfMe.userConversations.filter(
              conversation => conversation.s_key !== subscribeToDeleteUserConversation.s_key
            ),
          ],
        },
      };
    },
    onError: error => {
      if (
        error.errorMessage &&
        error.errorMessage.includes('Socket') &&
        !error.errorMessage.includes('undefined')
      ) {
        setTimeout(() => {
          makeSubscribeToCreateMessages(subscribeToMore, userId);
        }, 100);
      }
    },
  });
};

const GraphQLOperationsMessages = {
  listConversations: graphql(ListConversations, {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      variables: { userId: props.userId, nextToken: null },
      notifyOnNetworkStatusChange: true,
      skip: !props.userId || props.userId === '#',
    }),
    props: props => {
      const nextToken = _.get(
        props,
        ['listConversations', 'allConversationsOfMe', 'nextToken'],
        null
      );
      return {
        onFetchMoreConversations: () =>
          makeOnFetchMoreConversations(
            props.listConversations.fetchMore,
            nextToken,
            props.ownProps.userId
          ),
        subscribeToCreateUserConversations: () =>
          makeSubscribeToCreateUserConversations(
            props.listConversations.subscribeToMore,
            props.ownProps.userId
          ),
        subscribeToDeleteUserConversations: () =>
          makeSubscribeToDeleteUserConversations(
            props.listConversations.subscribeToMore,
            props.ownProps.userId
          ),
        listConversations: props.listConversations,
      };
    },
    name: 'listConversations',
  }),

  listMessages: graphql(ListMessages, {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      variables: { conversationId: props.conversationId, nextToken: null },
      skip: !props.conversationId || props.conversationId === '#',
    }),
    props: props => {
      const nextToken = _.get(props, ['listMessages', 'allMessages', 'nextToken'], null);
      return {
        onFetchMoreMessages: () =>
          makeOnFetchMoreMessages(
            props.listMessages.fetchMore,
            nextToken,
            props.ownProps.conversationId
          ),
        subscribeToCreateMessages: conversationId =>
          makeSubscribeToCreateMessages(props.listMessages.subscribeToMore, conversationId),
        listMessages: props.listMessages,
      };
    },
    name: 'listMessages',
  }),

  CreateNewMessage: graphql(CreateMessage, {
    props: props => ({
      onAddMessage: Message =>
        props.mutate({
          variables: Message,
          optimisticResponse: () => ({
            __typename: 'Mutation',
            createMessage: {
              pk: Message.pk,
              _id: `message_${Message.createdAt}_${Message.pk}`,
              s_key: `message_${Message.createdAt}_${Message.pk}`,
              authorId: Message.sender,
              content_search: Message.content,
              createdAt: Message.createdAt,
              isSent: false,
              __typename: 'CreateMessage',
            },
          }), // aici am ramas
          update: (store, { data: { createMessage } }) => {
            try {
              const data = store.readQuery({
                query: ListMessages,
                variables: {
                  conversationId: props.ownProps.conversationId,
                  nextToken: null,
                },
              });
              // console.log('Add new message:', data);
              // workaround: the update is called twice with optimistic response because of awf offlinelink redirect
              // see explanation here: https://stackoverflow.com/questions/48942175/apollo-update-method-getting-called-twice-both-times-with-optimistic-fake-d
              if (!data.allMessages.messages.some(el => el.s_key === createMessage.s_key)) {
                data.allMessages.messages.unshift(createMessage);
                // console.log('new message: ', props.ownProps);
                store.writeQuery({
                  query: ListMessages,
                  data,
                  variables: { conversationId: props.ownProps.conversationId, nextToken: null },
                });
              }
            } catch {
              console.log('GQLOp: Error in create message function');
            }
          },
        }),
    }),
  }),

  CreateNewConversation: graphql(CreateConversation, {
    props: props => ({
      onAddConversation: conversation =>
        props.mutate({
          variables: conversation,
        }),
    }),
  }),

  CreateNewUserConversation: graphql(CreateUserConversations, {
    props: props => ({
      onAddUserConversations: userConversations =>
        props.mutate({
          variables: userConversations,
          optimisticResponse: () => ({
            __typename: 'Mutation',
            createUserConversations: {
              pk: userConversations.conversationId,
              s_key: `member_${userConversations.userId}`,
              createdAt: userConversations.createdAt,
              conversation: {
                pk: userConversations.conversationId,
                createdAt: userConversations.createdAt,
                messages: {
                  messages: [
                    {
                      __typename: 'Message',
                      content_search: '',
                      authorId: '#',
                      createdAt: userConversations.createdAt,
                    },
                  ],
                  __typename: 'MessageConnection',
                },
                __typename: 'Conversation',
              },
              user: {
                pk: userConversations.userId,
                content_search: 'temp',
                __typename: 'PlateNumber',
              },
              associated: [
                {
                  __typename: 'UserConversations',
                  user: {
                    pk: userConversations.userId,
                    content_search: 'temp',
                    __typename: 'PlateNumber',
                  },
                },
              ],
              __typename: 'CreateUserConversations',
            },
          }), // aici am ramas
          update: (store, { data: { createUserConversations } }) => {
            try {
              const data = store.readQuery({
                query: ListConversations,
                variables: { userId: props.ownProps.userId, nextToken: null },
              });
              // console.log('Add new user conversations:', data);
              // workaround: the update is called twice with optimistic response because of awf offlinelink redirect
              // see explanation here: https://stackoverflow.com/questions/48942175/apollo-update-method-getting-called-twice-both-times-with-optimistic-fake-d
              if (
                !data.allConversationsOfMe.userConversations.some(
                  el =>
                    el.s_key === createUserConversations.s_key &&
                    el.pk === createUserConversations.pk
                )
              ) {
                data.allConversationsOfMe.userConversations.push(createUserConversations);
                store.writeQuery({
                  query: ListConversations,
                  data,
                  variables: { userId: props.ownProps.userId, nextToken: null },
                });
              }
            } catch {
              console.log('GQLOp: Error in create user conversations function');
            }
          },
        }),
    }),
  }),

  DeleteConversation: graphql(DeleteConversation, {
    props: props => ({
      onDeleteConversation: pk =>
        props.mutate({
          variables: pk,
        }),
    }),
  }),

  DeleteUserConversations: graphql(DeleteUserConversations, {
    props: props => ({
      onDeleteUserConversations: inputData =>
        inputData.userId === props.userId
          ? props.mutate({
              variables: inputData,
              refetchQueries: [
                {
                  query: ListConversations,
                  variables: { userId: inputData.userId, nextToken: null },
                },
              ],
            })
          : props.mutate({
              variables: inputData,
            }),
    }),
  }),
};
export default GraphQLOperationsMessages;
