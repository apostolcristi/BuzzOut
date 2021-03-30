import gql from 'graphql-tag';

const CreateUserConversationsSubscription = gql`
  subscription subscribeToNewUserConversation($userId: ID!) {
    subscribeToNewUserConversation(s_key: $userId) {
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

export default CreateUserConversationsSubscription;
