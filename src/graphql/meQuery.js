import gql from 'graphql-tag';

const MeQuery = gql`
  query meQuery($pk: ID!) {
    me(pk: $pk) {
      pk
      expoToken
      content_search
      createdAt
      phoneNumber
    }
  }
`;

export default MeQuery;
