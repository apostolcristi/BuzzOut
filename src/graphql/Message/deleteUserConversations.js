import gql from 'graphql-tag';

const DeleteUserConversations = gql`
  mutation deleteUserConversations($conversationId: ID!, $userId: ID!) {
    deleteUserConversations(input: { conversationId: $conversationId, userId: $userId }) {
      pk
      s_key
    }
  }
`;
export default DeleteUserConversations;
