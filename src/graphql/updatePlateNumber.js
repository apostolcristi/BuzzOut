import gql from 'graphql-tag';

const UpdatePlateNumber = gql`
  mutation updatePlateNumber($pk: ID!, $plateNumber: String!, $phoneNumber: String) {
    updatePlateNumber(input: { pk: $pk, content_search: $plateNumber, phoneNumber: $phoneNumber }) {
      pk
      createdAt
      content_search
      phoneNumber
      expoToken
    }
  }
`;

export default UpdatePlateNumber;
