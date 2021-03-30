import gql from 'graphql-tag';

const CreateMessage = gql`
  mutation createMessage(
    $pk: ID!
    $conversationId: ID!
    $content: String!
    $sender: String
    $createdAt: AWSDateTime!
  ) {
    createMessage(
      input: {
        pk: $pk
        conversationId: $conversationId
        content: $content
        sender: $sender
        createdAt: $createdAt
      }
    ) {
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

export default CreateMessage;
