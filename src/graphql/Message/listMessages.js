import gql from 'graphql-tag';

const ListMessages = gql`
  query listMessages($conversationId: ID!, $nextToken: String) {
    allMessages(conversationId: $conversationId, after: $nextToken) {
      messages {
        pk
        _id: s_key
        authorId
        s_key
        createdAt
        content_search
        isSent
      }
      nextToken
    }
  }
`;

// TODO: do not return an id because it will be the conversationId identical to all
// apollo cache will duplicate the first element ignoring all other messages
// use as _id for apollo the message unique id s_key

export default ListMessages;
