import { graphql } from 'react-apollo';
import _ from 'lodash';
import ListPlateNumbers from './listPlateNumbers';
// import SearchPlateNumber from './searchPlateNumber';
import CreatePlateNumber from './createPlateNumber';
import DeletePlateNumber from './deletePlateNumber';
import CreatePlateNumberSubscription from './createPlateNumberSubscription';
import DeletePlateNumberSubscription from './deletePlateNumberSubscription';
import UpdatePlateNumber from './updatePlateNumber';
import UpdatePlateNumberSubscription from './updatePlateNumberSubscription';
import MeQuery from './meQuery';

const makeOnFetchMore = (fetchMore, nextToken) => {
  if (!nextToken) {
    return null;
  }
  return () => {
    fetchMore({
      query: ListPlateNumbers,
      variables: {
        nextToken,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return {
          ...previousResult,
          allPlateNumbers: {
            ...previousResult.allPlateNumbers,
            ...fetchMoreResult.allPlateNumbers,
            items: [
              ...previousResult.allPlateNumbers.items,
              ...fetchMoreResult.allPlateNumbers.items,
            ],
          },
        };
      },
    });
  };
};

// const makeOnSearch = (fetchMore, searchQuery) => {
//   return fetchMore({
//     query: searchQuery === '' ? ListPlateNumbers : SearchPlateNumber,
//     variables: {
//       searchQuery,
//     },
//     updateQuery: (previousResult, { fetchMoreResult }) => {
//       if (!fetchMoreResult) {
//         return previousResult;
//       }
//       return {
//         ...previousResult,
//         allPlateNumbers: {
//           ...previousResult.allPlateNumbers,
//           items: [...fetchMoreResult.allPlateNumbers.items],
//         },
//       };
//     },
//   });
// };

const makeSubscribeToCreatePlateNumber = subscribeToMore => {
  return subscribeToMore({
    document: CreatePlateNumberSubscription,
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { onCreatePlateNumber },
        },
      }
    ) => {
      if (!onCreatePlateNumber) {
        return previousResult;
      }
      return {
        ...previousResult,
        allPlateNumbers: {
          ...previousResult.allPlateNumbers,
          items: [
            onCreatePlateNumber,
            ...previousResult.allPlateNumbers.items.filter(
              inputData => inputData.pk !== onCreatePlateNumber.pk
            ),
          ],
        },
      };
    },
    onError: error => {
      if (
        error.errorMessage &&
        error.errorMessage.includes('Socket') &&
        !error.errorMessage.includes('undefined')
      ) {
        setTimeout(() => {
          makeSubscribeToCreatePlateNumber(subscribeToMore);
        }, 100);
      }
    },
  });
};

const makeSubscribeToDeletePlateNumber = subscribeToMore => {
  return subscribeToMore({
    document: DeletePlateNumberSubscription,
    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { onDeletePlateNumber },
        },
      }
    ) => {
      if (!onDeletePlateNumber) {
        return previousResult;
      }
      return {
        ...previousResult,
        allPlateNumbers: {
          ...previousResult.allPlateNumbers,
          items: [
            ...previousResult.allPlateNumbers.items.filter(
              inputData => inputData.pk !== onDeletePlateNumber.pk
            ),
          ],
        },
      };
    },
    onError: error => {
      if (
        error.errorMessage &&
        error.errorMessage.includes('Socket') &&
        !error.errorMessage.includes('undefined')
      ) {
        setTimeout(() => {
          makeSubscribeToDeletePlateNumber(subscribeToMore);
        }, 100);
      }
    },
  });
};

const makeSubscribeToUpdatePlateNumber = subscribeToMore => {
  return subscribeToMore({
    document: UpdatePlateNumberSubscription,

    updateQuery: (
      previousResult,
      {
        subscriptionData: {
          data: { onUpdatePlateNumber },
        },
      }
    ) => {
      if (!onUpdatePlateNumber) {
        return previousResult;
      }
      return {
        ...previousResult,
        allPlateNumbers: {
          ...previousResult.allPlateNumbers,
          items: [
            onUpdatePlateNumber,
            ...previousResult.allPlateNumbers.items.filter(
              inputData => inputData.pk !== onUpdatePlateNumber.pk
            ),
          ],
        },
      };
    },
    onError: error => {
      if (
        error.errorMessage &&
        error.errorMessage.includes('Socket') &&
        !error.errorMessage.includes('undefined')
      ) {
        setTimeout(() => {
          makeSubscribeToUpdatePlateNumber(subscribeToMore);
        }, 100);
      }
    },
  });
};

const GraphQLOperations = {
  me: graphql(MeQuery, {
    options: props => ({
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      variables: { pk: props.userId },
      skip: !props.userId || props.userId === '#',
    }),
    props: props => {
      return {
        me: props.me,
      };
    },
    name: 'me',
  }),

  listPlateNumbers: graphql(ListPlateNumbers, {
    options: () => ({
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      variables: { nextToken: null },
    }),
    props: props => {
      const nextToken = _.get(props, ['listPlateNumbers', 'allPlateNumbers', 'nextToken'], null);
      return {
        // onSearch: searchQuery => makeOnSearch(props.listPlateNumbers.fetchMore, searchQuery),
        onFetchMore: () => makeOnFetchMore(props.listPlateNumbers.fetchMore, nextToken),
        subscribeToCreatePlateNumber: () =>
          makeSubscribeToCreatePlateNumber(props.listPlateNumbers.subscribeToMore),
        subscribeToDeletePlateNumber: () =>
          makeSubscribeToDeletePlateNumber(props.listPlateNumbers.subscribeToMore),
        subscribeToUpdatePlateNumber: () =>
          makeSubscribeToUpdatePlateNumber(props.listPlateNumbers.subscribeToMore),
        listPlateNumbers: props.listPlateNumbers,
      };
    },
    name: 'listPlateNumbers',
  }),

  CreatePlateNumber: graphql(CreatePlateNumber, {
    props: props => ({
      onAdd: PlateNumber =>
        props.mutate({
          variables: PlateNumber,
          optimisticResponse: () => ({
            __typename: 'Mutation',
            createPlateNumber: {
              ...PlateNumber,
              createdAt: PlateNumber.lastModified,
              content_search: PlateNumber.plateNumber,
              __typename: 'CreatePlateNumber',
            },
          }),
          update: (store, { data: { createPlateNumber } }) => {
            try {
              const data = store.readQuery({
                query: ListPlateNumbers,
                variables: { nextToken: null },
              });
              // console.log('AddPlateNumber: ', data);

              // console.log(data.listPlateNumbers.items.length);
              // console.log('plate number', createPlateNumber);
              // workaround: the update is called twice with optimistic response because of awf offlinelink redirect
              // see explanation here: https://stackoverflow.com/questions/48942175/apollo-update-method-getting-called-twice-both-times-with-optimistic-fake-d
              if (!data.allPlateNumbers.items.some(el => el.pk === createPlateNumber.pk)) {
                data.allPlateNumbers.items.push(createPlateNumber);
                // console.log('DataAfter:', data);
                store.writeQuery(
                  {
                    query: ListPlateNumbers,
                    data,
                    variables: { nextToken: null },
                  }
                  // console.log('write querry')
                );
              }
            } catch {
              console.log('GQLOp: Error in create plate number update function');
            }
          },
        }),
    }),
  }),

  DeletePlateNumber: graphql(DeletePlateNumber, {
    props: props => ({
      onDelete: inputData =>
        props.mutate({
          variables: inputData,
          optimisticResponse: () => ({
            __typename: 'Mutation',
            deletePlateNumber: { ...inputData, __typename: 'DeletePlateNumber' },
          }),
          update: (client, { data: { deletePlateNumber } }) => {
            try {
              const data = client.readQuery({
                query: ListPlateNumbers,
                variables: { nextToken: null },
              });
              // console.log('Delete:', data);

              const newData = _.filter(data.allPlateNumbers.items, item => {
                return item.pk !== deletePlateNumber.pk;
              });
              // console.log('new del data:', newData);
              client.writeQuery({
                query: ListPlateNumbers,
                data: {
                  ...data,
                  allPlateNumbers: {
                    ...data.allPlateNumbers,
                    items: [...newData],
                  },
                },
                variables: { nextToken: null },
              });
            } catch {
              console.log('GQLOp:Error in delete plate number update function');
            }
          },
        }),
    }),
  }),

  UpdatePlateNumber: graphql(UpdatePlateNumber, {
    props: props => ({
      onUpdate: inputData =>
        props.mutate({
          variables: inputData,
          optimisticResponse: () => ({
            __typename: 'MutationUpdatePlateNumber',
            updatePlateNumber: {
              pk: inputData.pk,
              content_search: inputData.plateNumber,
              phoneNumber: inputData.phoneNumber,
              expoToken: 'tempToken',
              createdAt: 'tempDate',
              __typename: 'UpdatePlateNumber',
            },
          }),
          update: (store, { data: { updatePlateNumber } }) => {
            try {
              const data = store.readQuery({
                query: ListPlateNumbers,
                variables: { nextToken: null },
              });
              const newData = _.filter(data.allPlateNumbers.items, item => {
                return item.pk !== updatePlateNumber.pk;
              });
              if (!newData.some(el => el.pk === updatePlateNumber.pk)) {
                newData.push(updatePlateNumber);
                store.writeQuery({
                  query: ListPlateNumbers,
                  data: {
                    ...data,
                    listPlateNumbers: {
                      ...data.allPlateNumbers,
                      items: [...newData],
                    },
                  },
                  variables: { nextToken: null },
                });
              }
            } catch {
              console.log('GQLOp: Error in Update plate number -  update function');
            }
          },
        }),
    }),
  }),
};

export default GraphQLOperations;
