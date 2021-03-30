import gql from 'graphql-tag';

const CreatePlateNumberSubscription = gql`
  subscription createPlateNumberSubscription {
    onCreatePlateNumber {
      pk
      createdAt
      content_search
      phoneNumber
      expoToken
    }
  }
`;

export default CreatePlateNumberSubscription;
