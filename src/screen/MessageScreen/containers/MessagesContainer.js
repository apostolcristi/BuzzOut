import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  FlatList,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button, Icon, ListItem } from 'react-native-elements';
import { compose } from 'react-apollo';
import KeyboardListener from 'react-native-keyboard-listener';
// import * as ImagePicker from 'expo-image-picker';
import { uuid } from 'uuidv4';
import { Header } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../style';
import GraphQLOperationsMessages from '../../../graphql/Message/indexMessages';
import { ActivityIndicatorBuzz } from '../../../components/ActivityIndicatorBuzz';
import GraphQLOperations from '../../../graphql';

const { height, width } = Dimensions.get('window');

class MessageScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendText: '',
      PictureView: false,
      TextInputHeight: 0,
      paddingView: 10,
      viewHeight: 0,
      // TODO: USED FOR DELETION // conversationToDelete: '#',
      // userConversationToDelete: '#',
    };
    this.arrayholder = [];
    this.conversationId = '#';
    // TODO: use for deletion // this.oneMessageAlreadySent = false;
    this.unsubscribeNewMessage = null;
    this.unsubscribeCreateUserConversations = null;
    // this.unsubscribeDeleteUserConversations = null;
  }

  componentDidMount = async () => {
    const {
      subscribeToCreateMessages,
      subscribeToCreateUserConversations,
      // subscribeToDeleteUserConversations,
      conversationId,
    } = this.props;
    try {
      if (this.unsubscribeCreateUserConversations) {
        this.unsubscribeCreateUserConversations();
      }
      this.unsubscribeCreateUserConversations = subscribeToCreateUserConversations();

      if (conversationId !== '#') {
        if (this.unsubscribeNewMessage) {
          this.unsubscribeNewMessage();
        }
        this.unsubscribeNewMessage = subscribeToCreateMessages(conversationId);
      }
    } catch (error) {
      console.log('Error: subscribe apollo messages container');
    }
  };

  componentWillUnmount = () => {
    try {
      if (this.unsubscribeNewMessage) {
        this.unsubscribeNewMessage();
      }
      if (this.unsubscribeCreateUserConversations) {
        this.unsubscribeCreateUserConversations();
      }
      // if (this.unsubscribeDeleteUserConversations) {
      //   this.unsubscribeDeleteUserConversations();
      // }
      // TODO: add for deletion
      // if (!this.oneMessageAlreadySent) {
      //   this.deleteConversations();
      // }
    } catch (error) {
      console.log('Error: unsubscribe apollo messages container');
    }
    Keyboard.dismiss();
  };

  MessageDate = () => {
    const today = new Date();
    const event1 = new Date();
    event1.setHours(today.getHours() + 3);
    const blockingDate = event1.toJSON();
    return blockingDate;
  };

  changeDate = MessageDate => {
    const date = new Date(MessageDate).toUTCString();
    return date.slice(5, 22);
  };

  onChoosePic = async () => {
    Alert.alert(
      'Atentie!',
      'Momentan nu se pot atasa imagini',
      [{ text: 'Inapoi', onPress: () => null }],
      {
        cancelable: false,
      }
    );
    // const { cancelled } = await ImagePicker.launchImageLibraryAsync();
    // if (!cancelled) {
    // this.setState({ imgUri: uri });
    // console.log(uri) // this logs correctly
    // TODO: why isn't this showing up inside the Image on screen?
    // }
  };

  onTakePic = async () => {
    Alert.alert(
      'Atentie!',
      'Momentan nu se poate folosi camera',
      [{ text: 'Inapoi', onPress: () => null }],
      {
        cancelable: false,
      }
    );
    // const { cancelled } = await ImagePicker.launchCameraAsync({});
    // if (!cancelled) {
    //   // this.setState({ imgUri: uri });
    // }
  };

  // takePic = () => {
  //   Alert.alert(
  //     'Atentie!',
  //     'Momentan nu se pot atasa imagini',
  //     [{ text: 'Inapoi', onPress: () => null }],
  //     {
  //       cancelable: false,
  //     }
  //   );
  //   // ImagePicker.showImagePicker({}, response => {
  //   //   console.log(response);
  //   // });
  // };

  handleKeyPress = ({ nativeEvent: { key: keyValue } }) => {
    // console.log('Key', keyValue);
    if (keyValue === 'Enter') {
      Keyboard.dismiss();
    }
  };

  addNewMessage = () => {
    const { sendText } = this.state;
    const {
      onAddMessage,
      userId,
      onAddConversation,
      onAddUserConversations,
      receiverId,
      conversationId,
      subscribeToCreateMessages,
    } = this.props;

    const createdAt = this.MessageDate();
    const pk = uuid();
    if (conversationId === '#' && this.conversationId === '#') {
      this.conversationId = uuid();

      if (this.unsubscribeNewMessage) {
        this.unsubscribeNewMessage();
      }
      this.unsubscribeNewMessage = subscribeToCreateMessages(this.conversationId);

      onAddConversation({ pk: this.conversationId, createdAt });
      onAddUserConversations({ conversationId: this.conversationId, createdAt, userId });
      onAddMessage({
        pk,
        conversationId: this.conversationId,
        content: sendText,
        createdAt,
        sender: userId || 'anonim',
      });
      onAddUserConversations({
        conversationId: this.conversationId,
        createdAt,
        userId: receiverId,
      });
    } else {
      if (conversationId !== '#') this.conversationId = conversationId;
      onAddMessage({
        pk,
        conversationId: this.conversationId,
        content: sendText,
        createdAt,
        sender: userId || 'anonim',
      });
    }

    this.setState({
      sendText: '',
      // TODO: used for deletion // conversationToDelete: conversationId,
      // userConversationToDelete: pk,
    });
  };

  // TODO: used for deletion
  // deleteConversations = () => {
  //   const { conversationToDelete, userConversationToDelete } = this.state;
  //   const { onDeleteConversation, onDeleteUserConversations, userId } = this.props;
  //   onDeleteConversation({ pk: conversationToDelete });
  //   onDeleteUserConversations({
  //     conversationId: conversationToDelete,
  //     userId: userConversationToDelete,
  //   });
  //   onDeleteUserConversations({
  //     conversationId: conversationToDelete,
  //     userId,
  //   });

  //   this.setState({ conversationToDelete: '#', userConversationToDelete: '#' });
  // };

  listEmptyComponent = loading => {
    return (
      <View>
        <ListItem
          containerStyle={{ alignContent: 'flex-end', height: height / 2 + 200 }}
          titleStyle={styles.emptyList}
          title="Nu exista nici un mesaj momentan"
        />
        {loading ? <ActivityIndicatorBuzz /> : null}
      </View>
    );
  };

  render() {
    const { sendText, PictureView, TextInputHeight, paddingView, viewHeight } = this.state;
    const { listMessages, userId, onFetchMoreMessages, conversationId } = this.props;
    let disabled;

    // console.log(this.props);

    if (
      listMessages !== undefined &&
      listMessages.allMessages !== undefined &&
      listMessages.allMessages.messages !== undefined &&
      listMessages.allMessages.messages.length !== 0
    ) {
      this.arrayholder = listMessages.allMessages.messages;
      // TODO: add for deletion // this.oneMessageAlreadySent = true;
    } else {
      this.arrayholder = [];
      // TODO: add for deletion // this.oneMessageAlreadySent = false;
    }

    if (sendText === '' && sendText.trim().length === 0) disabled = true;
    else disabled = false;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Header.HEIGHT + 28}
        style={styles.Keycontainer}
        enabled
      >
        <View style={{ flex: 1 }}>
          {listMessages.error && !listMessages.loading ? (
            <Text
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: '500',
              }}
            >
              `ERROR: ${listMessages.error}`
            </Text>
          ) : null}
          {listMessages.loading && listMessages.networkStatus !== 4 ? (
            <ActivityIndicatorBuzz />
          ) : null}

          <View style={{ flex: 14 }}>
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                alignSelf: 'flex-end',
                flexGrow: 1,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={listMessages.networkStatus === 4 || listMessages.loading === 1}
                  onRefresh={() => listMessages.refetch()}
                />
              }
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              requiresSameParentToManageScrollView
              ref={ref => {
                this.flatlist = ref;
              }}
              onContentSizeChange={() => this.flatlist.scrollToEnd({ animated: true })}
              onLayout={() => this.flatlist.scrollToEnd({ animated: true })}
              initialNumToRender={1}
            >
              <FlatList
                style={{ flex: 9 }}
                data={this.arrayholder}
                inverted={this.arrayholder.length}
                onEndReached={onFetchMoreMessages()}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  !listMessages.error ? this.listEmptyComponent(listMessages.loading) : null
                }
                renderItem={({ item }) => (
                  <View style={{ flex: 1 }}>
                    <View
                      flexDirection="row"
                      alignSelf={item.authorId !== userId ? 'flex-start' : 'flex-end'}
                      style={
                        ([item.authorId !== userId ? { marginLeft: 10 } : { marginRight: 10 }],
                        { maxWidth: width / 1.2 })
                      }
                    >
                      {item.authorId !== userId && (
                        <View
                          style={{
                            paddingTop: 4,
                            width: 0,
                            height: 0,
                            backgroundColor: 'transparent',
                            borderStyle: 'solid',
                            borderRightWidth: 10,
                            borderTopWidth: 10,
                            borderRightColor: 'transparent',
                            borderTopColor: item.authorId !== userId ? '#e8eaed' : '#1084ff',
                            transform:
                              item.authorId !== userId
                                ? [{ rotate: '90deg' }]
                                : [{ rotate: '0deg' }],
                          }}
                        />
                      )}
                      {item.authorId === userId && (
                        <Icon
                          name="check"
                          type="font-awesome"
                          color={!item.isSent ? 'gray' : '#1084ff'}
                          containerStyle={{
                            backgroundColor: 'transparent',
                            marginRight: 10,
                            marginBottom: 18,
                            marginTop: 6,
                          }}
                          underlayColor="rgba(0,0,0,0.0)"
                          size={16}
                          onPress={this.onTakePic}
                        />
                      )}
                      <View
                        style={{
                          borderRadius: 6,
                          backgroundColor: item.authorId !== userId ? '#e8eaed' : '#1084ff',
                          alignSelf: 'flex-start',
                          minHeight: 10,
                          width: '70%',
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            marginLeft: 10,
                            paddingTop: 10,
                            color: item.authorId !== userId ? '#5c5c5c' : 'white',
                            paddingBottom: 10,
                            paddingRight: 10,
                            fontSize: 18,
                          }}
                        >
                          {item.content_search}
                        </Text>
                      </View>
                      {item.authorId !== userId && (
                        <Icon
                          name="check"
                          type="font-awesome"
                          color={!item.isSent ? 'gray' : '#1084ff'}
                          containerStyle={{
                            backgroundColor: 'transparent',
                            marginLeft: 10,
                            marginBottom: 18,
                            marginTop: 6,
                          }}
                          underlayColor="rgba(0,0,0,0.0)"
                          size={16}
                          onPress={this.onTakePic}
                        />
                      )}
                      {item.authorId === userId && (
                        <View
                          style={{
                            marginTop: 4,
                            width: 0,
                            height: 0,
                            backgroundColor: 'transparent',
                            borderStyle: 'solid',
                            borderRightWidth: 10,
                            borderTopWidth: 10,
                            borderRightColor: 'transparent',
                            borderTopColor: item.authorId !== userId ? '#e8eaed' : '#1084ff',
                            transform:
                              item.authorId !== userId
                                ? [{ rotate: '90deg' }]
                                : [{ rotate: '0deg' }],
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        color: 'grey',
                        textAlign: item.authorId !== userId ? 'left' : 'right',
                        marginLeft: 10,
                        fontSize: 16,
                      }}
                    >
                      {this.changeDate(item.createdAt)}
                    </Text>
                  </View>
                )}
                keyExtractor={item => item.s_key}
              />
            </ScrollView>
          </View>

          <View
            style={{
              marginBottom: viewHeight,
              flexDirection: 'row',
              backgroundColor: '#2089dc',
              flex: Math.max(1, TextInputHeight),
              justifyContent: 'flex-end',
              paddingBottom: paddingView,
              paddingTop: 10,
            }}
          >
            <KeyboardListener
              onWillHide={() =>
                this.setState({ TextInputHeight: 0, paddingView: 10, viewHeight: -10 })
              }
              onWillShow={() => {
                this.setState({ TextInputHeight: 2, paddingView: 0, viewHeight: -10 });
                this.flatlist.scrollToEnd();
              }}
            />

            <Icon
              name="camera-retro"
              type="font-awesome"
              color="white"
              containerStyle={{
                backgroundColor: '#2089dc',
                marginLeft: 20,
                marginBottom: 18,
                marginTop: 6,
              }}
              underlayColor="rgba(0,0,0,0.0)"
              size={32}
              onPress={this.onTakePic}
            />
            <Icon
              name="image"
              type="font-awesome"
              color="white"
              containerStyle={{
                backgroundColor: '#2089dc',
                marginLeft: 20,
                marginBottom: 18,
                marginTop: 6,
                marginRight: 20,
              }}
              underlayColor="rgba(0,0,0,0.0)"
              size={32}
              onPress={this.onChoosePic}
            />

            <View
              style={{
                flex: 3,
                width: '30%',
                height: '90%',
                alignContent: 'flex-start',
                alignSelf: 'center',
                borderRadius: 16,
                justifyContent: 'center',
                backgroundColor: 'rgba(28, 118, 189, 0.2)',
                marginTop: Platform.OS === 'ios' ? -12 : -4,
              }}
            >
              <TextInput
                placeholder="Type a message"
                placeholderTextColor="white"
                keyboardType="web-search"
                returnKeyType="done"
                maxLength={100}
                onKeyPress={event => this.handleKeyPress(event)}
                blurOnSubmit
                onBlur={() => {
                  this.setState({ TextInputHeight: 0 });
                }}
                onFocus={() => {
                  this.setState({ TextInputHeight: 2 });
                }}
                style={{
                  justifyContent: 'flex-start',
                  paddingRight: 20,
                  paddingLeft: 20,
                  color: 'white',
                  borderRadius: 16,
                  borderColor: 'blue',
                  textAlign: 'left',
                  height: 40,
                  fontSize: 18,
                }}
                onChangeText={value => {
                  this.setState({ sendText: value });
                  // console.log('value', sendText);
                }}
                value={sendText}
                onSubmitEditing={() => {
                  if (sendText !== '' || sendText.trim().length !== 0)
                    this.addNewMessage(conversationId);
                }}
              />
            </View>
            <Button
              title="Send"
              onPress={() => {
                // console.log('Send');
                this.addNewMessage(conversationId);
              }}
              disabledStyle={{ backgroundColor: '#2089dc' }}
              disabledTitleStyle={{ color: 'white' }}
              disabled={disabled}
              style={{ flex: 1, backgroundColor: '#2089dc' }}
              containerStyle={{
                backgroundColor: '#2089dc',
                marginRight: 20,
                marginTop: Platform.OS === 'ios' ? 0 : -4,
              }}
              buttonStyle={{ backgroundColor: '#2089dc' }}
            />
          </View>
          {PictureView ? (
            <View
              style={{
                flexDirection: 'row',

                alignItems: 'flex-start',
                alignSelf: 'flex-start',
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 2,
                borderColor: 'black',
                borderWidth: 2,
              }}
            >
              <Icon
                name="camera-retro"
                type="font-awesome"
                color="white"
                containerStyle={{
                  backgroundColor: '#2089dc',
                }}
                size={50}
              />
              <Icon
                name="image"
                type="font-awesome"
                color="white"
                containerStyle={{ backgroundColor: '#2089dc', marginLeft: 10 }}
                size={50}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

MessageScreenContainer.defaultProps = {
  conversationId: '#',
};

MessageScreenContainer.propTypes = {
  subscribeToCreateMessages: PropTypes.func.isRequired,
  listMessages: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.shape({})])
    .isRequired,
  onAddMessage: PropTypes.func.isRequired,
  subscribeToCreateUserConversations: PropTypes.func.isRequired,
  // subscribeToDeleteUserConversations: PropTypes.func.isRequired,
  onAddConversation: PropTypes.func.isRequired,
  onAddUserConversations: PropTypes.func.isRequired,
  onFetchMoreMessages: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  conversationId: PropTypes.string,
  receiverId: PropTypes.string.isRequired,

  // onDeleteConversation: PropTypes.func.isRequired, //TODO: not impemented
  // onDeleteUserConversations: PropTypes.func.isRequired,
};
export default compose(
  GraphQLOperations.me,
  GraphQLOperationsMessages.listConversations,
  GraphQLOperationsMessages.listMessages,
  GraphQLOperationsMessages.CreateNewMessage,
  GraphQLOperationsMessages.CreateNewConversation,
  GraphQLOperationsMessages.CreateNewUserConversation
  // GraphQLOperationsMessages.DeleteConversation, //TODO: not impemented
  // GraphQLOperationsMessages.DeleteUserConversations,
)(MessageScreenContainer);
