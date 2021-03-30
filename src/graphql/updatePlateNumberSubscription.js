import gql from 'graphql-tag';

const UpdatePlateNumberSubscription = gql`
  subscription updatePlateNumberSubscription {
    onUpdatePlateNumber {
      pk
      createdAt
      content_search
      phoneNumber
      expoToken
    }
  }
`;

export default UpdatePlateNumberSubscription;
