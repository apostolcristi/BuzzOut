import gql from 'graphql-tag';

const DeletePlateNumberSubscription = gql`
  subscription deletePlateNumberSubscription {
    onDeletePlateNumber {
      pk
    }
  }
`;

export default DeletePlateNumberSubscription;
