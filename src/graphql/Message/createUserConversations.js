import gql from 'graphql-tag';

const CreateUserConversations = gql`
  mutation createUserConversations($conversationId: ID!, $userId: ID!, $createdAt: AWSDateTime) {
    createUserConversations(
      input: { conversationId: $conversationId, createdAt: $createdAt, userId: $userId }
    ) {
      pk
      s_key
      createdAt
      conversation {
        pk
        createdAt
        messages(first: 1) {
          messages {
            content_search
            authorId
            createdAt
          }
        }
      }
      user {
        pk
        content_search
      }
      associated {
        user {
          pk
          content_search
        }
      }
    }
  }
`;

export default CreateUserConversations;
