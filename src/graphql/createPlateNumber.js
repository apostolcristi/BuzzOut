import gql from 'graphql-tag';

const CreatePlateNumber = gql`
  mutation createPlateNumber(
    $pk: ID!
    $plateNumber: String!
    $phoneNumber: String
    $lastModified: AWSDateTime
    $expoToken: String
  ) {
    createPlateNumber(
      input: {
        pk: $pk
        plateNumber: $plateNumber
        phoneNumber: $phoneNumber
        lastModified: $lastModified
        expoToken: $expoToken
      }
    ) {
      pk
      createdAt
      expoToken
      phoneNumber
      content_search
    }
  }
`;

export default CreatePlateNumber;
