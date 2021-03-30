import gql from 'graphql-tag';

const ListConversations = gql`
  query listConversations($userId: ID!, $nextToken: String) {
    allConversationsOfMe(userId: $userId, after: $nextToken) {
      userConversations {
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
      nextToken
    }
  }
`;

export default ListConversations;
