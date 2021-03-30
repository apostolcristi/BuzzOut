import gql from 'graphql-tag';

const ListPlateNumbers = gql`
  query listPlateNumbers($nextToken: String, $first: Int) {
    allPlateNumbers(after: $nextToken, first: $first) {
      items {
        pk
        createdAt
        content_search
        phoneNumber
        expoToken
      }
      nextToken
    }
  }
`;

export default ListPlateNumbers;
