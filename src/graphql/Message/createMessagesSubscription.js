import gql from 'graphql-tag';

const CreateMessageSubscription = gql`
  subscription createMessageSubscription($conversationId: ID!) {
    subscribeToNewMessage(pk: $conversationId) {
      pk
      _id: s_key
      authorId
      s_key
      createdAt
      content_search
      isSent
    }
  }
`;

export default CreateMessageSubscription;
