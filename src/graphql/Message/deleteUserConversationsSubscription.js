import gql from 'graphql-tag';

const DeleteUserConversationsSubscription = gql`
  subscription subscribeToNewUserConversation($userId: ID!) {
    subscribeToNewUserConversation(s_key: $userId) {
      pk
      s_key
    }
  }
`;

export default DeleteUserConversationsSubscription;
