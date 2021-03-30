import gql from 'graphql-tag';

const DeleteConversation = gql`
  mutation deleteConversation($pk: ID!) {
    deleteConversation(input: { pk: $pk }) {
      pk
    }
  }
`;
export default DeleteConversation;
