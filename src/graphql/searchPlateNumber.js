import gql from 'graphql-tag';

const SearchPlateNumber = gql`
  query searchPlateNumber($searchQuery: String) {
    listPlateNumbers(filter: { PlateNumber: { contains: $searchQuery } }) {
      items {
        pk
        plateNumber
        phoneNumber
        lastModified
        expoToken
      }
      nextToken
    }
  }
`;

export default SearchPlateNumber;
