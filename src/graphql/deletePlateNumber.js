import gql from 'graphql-tag';

const DeletePlateNumber = gql`
  mutation deletePlateNumber($pk: ID!) {
    deletePlateNumber(input: { pk: $pk }) {
      pk
    }
  }
`;
export default DeletePlateNumber;
