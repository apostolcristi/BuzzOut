import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements';
import { compose } from 'react-apollo';
import { PropTypes } from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../style';
import NavigationService from '../../../NavigationService';

import GraphQLOperationsMessages from '../../../graphql/Message/indexMessages';
import GraphQLOperations from '../../../graphql';
import { ActivityIndicatorBuzz } from '../../../components/ActivityIndicatorBuzz';

const { height } = Dimensions.get('window');
class ConversationsScreen extends Component {
  constructor(props) {
    super(props);
    this.arrayholder = [];
    // this.unsubscribeNewMessage = null;
    // this.unsubscribeCreateUserConversations = null;
  }

  componentDidMount() {
    const { subscribeToCreateUserConversations } = this.props;

    try {
      if (this.unsubscribeCreateUserConversations) {
        this.unsubscribeCreateUserConversations();
      }
      this.unsubscribeCreateUserConversations = subscribeToCreateUserConversations();

      //   // if (this.unsubscribeDeleteUserConversations) {
      //   //   this.unsubscribeDeleteUserConversations();
      //   // }
      //   // this.unsubscribeDeleteUserConversations = subscribeToDeleteUserConversations();
    } catch (error) {
      console.log('Error: subscribe apollo in Conversations container');
    }
    // listConversations.startPolling(1000);
  }

  componentWillUnmount() {
    // const { listConversations } = this.props;
    // listConversations.stopPolling();
    try {
      if (this.unsubscribeCreateUserConversations) {
        this.unsubscribeCreateUserConversations();
      }
    } catch (error) {
      console.log('Error: unsubscribe apollo conversations container');
    }
  }

  changeDate = MessageDate => {
    const date = new Date(MessageDate).toUTCString();
    return date.slice(0, 22);
  };

  renderItem = ({ item }) => {
    const { me } = this.props;
    let subtitleText = '';
    if (item.conversation.messages.messages.length) {
      subtitleText =
        item.conversation.messages.messages[0].content_search.length <= 20
          ? `${
              item.conversation.messages.messages[0].authorId === global.userId
                ? `Tu: ${item.conversation.messages.messages[0].content_search}`
                : item.conversation.messages.messages[0].content_search
            }`
          : `${
              item.conversation.messages.messages[0].authorId === global.userId
                ? `Tu: ${item.conversation.messages.messages[0].content_search
                    .slice(0, 17)
                    .concat('...')}`
                : item.conversation.messages.messages[0].content_search.slice(0, 17).concat('...')
            }`;
    }
    return (
      <ListItem
        Component={TouchableOpacity}
        containerStyle={{
          width: '96%',
          alignSelf: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          marginVertical: 10,
          backgroundColor: '#FFFFFFFF',
          borderRadius: 10,
          borderWidth: 0.2,
          elevation: 2,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'black',
          shadowOpacity: 0.3,
        }}
        title={
          item.associated.length > 1
            ? `${
                item.associated.find(el => el.user.content_search !== me.me.content_search).user
                  .content_search
              }`
            : ''
        }
        titleStyle={{
          width: '70%',
          marginBottom: 10,
          color: '#5c5c5c',
          fontSize: 26,
        }}
        subtitle={subtitleText}
        subtitleStyle={{ color: 'gray', fontSize: 16, width: '60%' }}
        rightSubtitle={this.changeDate(
          item.conversation.messages.messages.length
            ? item.conversation.messages.messages[0].createdAt
            : ''
        )}
        rightSubtitleStyle={{
          width: '160%',
          fontSize: 16,
          marginTop: 44,
          textAlignVertical: 'top',
          color: 'gray',
        }}
        onPress={() => {
          NavigationService.navigate('MessageScreen', {
            receiverPlateNumber: item.associated.find(
              el => el.user.content_search !== me.me.content_search
            ).user.content_search,
            receiverId: item.associated.find(el => el.user.content_search !== me.me.content_search)
              .user.pk,
            conversationId: item.conversation.pk,
          });
        }}
      />
    );
  };

  listEmptyComponent = loading => {
    return (
      <View>
        <ListItem
          containerStyle={{ alignContent: 'flex-end', height: height / 2 + 200 }}
          titleStyle={styles.emptyList}
          title="Nu sunt conversatii de vizualizat momentan"
        />
        {loading ? <ActivityIndicatorBuzz /> : null}
      </View>
    );
  };

  render() {
    const { listConversations, onFetchMoreConversations } = this.props;
    if (
      listConversations !== undefined &&
      listConversations.allConversationsOfMe !== undefined &&
      listConversations.allConversationsOfMe.userConversations !== undefined
    ) {
      this.arrayholder = listConversations.allConversationsOfMe.userConversations;
    } else {
      this.arrayholder = [];
    }

    return (
      <View>
        <FlatList
          data={this.arrayholder}
          ListEmptyComponent={
            !listConversations.error ? this.listEmptyComponent(listConversations.loading) : null
          }
          renderItem={this.renderItem}
          keyExtractor={item => item.pk}
          refreshing={listConversations.networkStatus === 4 || listConversations.loading === 1}
          onRefresh={() => listConversations.refetch()}
          contentContainerStyle={{ height: height - 90 }}
          scrollEnabled={!listConversations.loading}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onEndReached={onFetchMoreConversations()}
          onEndReachedThreshold={0.5}
        />
        {listConversations.error && !listConversations.loading ? (
          <Text
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: '500',
            }}
          >
            `ERROR: ${listConversations.error}`
          </Text>
        ) : null}
        {listConversations.loading && listConversations.networkStatus !== 4 ? (
          <ActivityIndicatorBuzz />
        ) : null}
      </View>
    );
  }
}

ConversationsScreen.propTypes = {
  subscribeToCreateUserConversations: PropTypes.func.isRequired,
  onFetchMoreConversations: PropTypes.func.isRequired,
  listConversations: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.shape({})])
    .isRequired,
  me: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.shape({})]).isRequired,
};
export default compose(
  GraphQLOperationsMessages.listConversations,
  GraphQLOperations.me
)(ConversationsScreen);
