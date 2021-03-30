import gql from 'graphql-tag';

const CreateConversation = gql`
  mutation createConversation($pk: ID!, $createdAt: AWSDateTime) {
    createConversation(input: { pk: $pk, createdAt: $createdAt }) {
      pk
      createdAt
    }
  }
`;

export default CreateConversation;
