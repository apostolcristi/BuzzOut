import React, { Component } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  SafeAreaView,
  AsyncStorage,
  Text,
  Vibration,
  Platform,
  Alert,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import DropdownAlert from 'react-native-dropdownalert';
import { Notifications } from 'expo';
import { Icon, ListItem, SearchBar, Button, Overlay } from 'react-native-elements';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import GraphQLOperations from '../../../graphql';

import styles from '../style';
import NavigationService from '../../../NavigationService';
import { ActivityIndicatorBuzz } from '../../../components/ActivityIndicatorBuzz';
import GraphQLOperationsMessages from '../../../graphql/Message/indexMessages';

const { height } = Dimensions.get('window');

class GetOutScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      count: 10,
      disable: false,
      clear: true,
      Data: [],
      placeholder: 'Cauta Masina',
      isConnected: true,
    };
    this.arrayholder = [];
    this.myInterval = 0;
    this.conversationId = '#';
    this.unsubscribeCreatePlateNumber = null;
    this.unsubscribeDeletePlateNumber = null;
    this.unsubscribeUpdatePlateNumber = null;
    this.unsubscribeCreateUserConversations = null;
  }

  componentDidMount = async () => {
    const {
      subscribeToCreatePlateNumber,
      subscribeToDeletePlateNumber,
      subscribeToUpdatePlateNumber,
      subscribeToCreateUserConversations,
    } = this.props;
    const unsubscribe = NetInfo.addEventListener(() => {});
    NetInfo.isConnected.addEventListener(this.handleConnectivityChange);
    (async () => {
      await this.registerForPushNotificationsAsync1();
    })();
    unsubscribe();
    try {
      if (this.unsubscribeCreatePlateNumber) {
        this.unsubscribeCreatePlateNumber();
      }
      this.unsubscribeCreatePlateNumber = subscribeToCreatePlateNumber();
      if (this.unsubscribeDeletePlateNumber) {
        this.unsubscribeDeletePlateNumber();
      }
      this.unsubscribeDeletePlateNumber = subscribeToDeletePlateNumber();
      if (this.unsubscribeUpdatePlateNumber) {
        this.unsubscribeUpdatePlateNumber();
      }
      this.unsubscribeUpdatePlateNumber = subscribeToUpdatePlateNumber();

      if (this.unsubscribeCreateUserConversations) {
        this.unsubscribeCreateUserConversations();
      }
      this.unsubscribeCreateUserConversations = subscribeToCreateUserConversations();

      // if (this.unsubscribeDeleteUserConversations) {
      //   this.unsubscribeDeleteUserConversations();
      // }
      // this.unsubscribeDeleteUserConversations = subscribeToDeleteUserConversations();
    } catch (error) {
      console.log('Error: subscribing to apollo plate number operations', error);
    }
  };

  componentWillUnmount() {
    clearInterval(this.myInterval);
    this.setState({ clear: true });
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    try {
      if (this.unsubscribeCreatePlateNumber) {
        this.unsubscribeCreatePlateNumber();
      }
      if (this.unsubscribeDeletePlateNumber) {
        this.unsubscribeDeletePlateNumber();
      }
      if (this.unsubscribeUpdatePlateNumber) {
        this.unsubscribeUpdatePlateNumber();
      }
      if (this.unsubscribeCreateUserConversations) {
        this.unsubscribeCreateUserConversations();
      }
    } catch (error) {
      console.log('Error: unsubscribe to apollo getout screen');
    }
  }

  getFormattedTime(time) {
    this.currentTime = time;
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  searchFilterFunction = text => {
    const textLower = text.toUpperCase();
    this.setState({ searchQuery: textLower });
  };

  handleNotification = notification => {
    if (notification) Vibration.vibrate(3000);
  };

  registerForPushNotificationsAsync1 = async () => {
    this.notificationSubscription = Notifications.addListener(this.handleNotification);
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  onSearchFilter = text => {
    const { listPlateNumbers } = this.props;
    const newData = listPlateNumbers.allPlateNumbers.items.filter(item => {
      const itemData = `${item.content_search}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ Data: newData });
  };

  renderHeader = () => {
    const { searchQuery, Title, placeholder } = this.state;
    return (
      <View style={styles.headerContainer}>
        <Icon
          size={24}
          iconStyle={{
            alignContent: 'center',
            justifyContent: 'center',
            marginLeft: 10,
            marginTop: 10,
            marginBottom: Platform.OS === 'ios' ? 24 : 0,
          }}
          name="chat"
          underlayColor="rgba(0,0,0,0.0)"
          containerStyle={{ marginRight: 20, paddingTop: 20 }}
          color="white"
          onPress={() => this.onPressConversations(Title)}
        />
        <SearchBar
          containerStyle={styles.searchBar}
          inputStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            textShadowColor: 'white',
            color: 'white',
            textDecorationColor: 'white',
          }}
          placeholderTextColor="white"
          rightIconContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          searchIcon={{ color: 'white' }}
          clearIcon={{ color: 'white' }}
          leftIconContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          inputContainerStyle={{ backgroundColor: 'rgba(28, 118, 189, 0.2)' }}
          placeholder={placeholder}
          lightTheme
          icon
          round
          onChangeText={text => {
            this.onSearchFilter(text);
            this.setState({ searchQuery: text });
          }}
          onFocus={() => {
            this.setState({ placeholder: ' ' });
          }}
          onBlur={() => {
            this.setState({ placeholder: 'Cauta Masina' });
          }}
          underlineColorAndroid="rgba(0,0,0,0.0)"
          autoCorrect={false}
          value={searchQuery}
        />

        <Icon
          size={24}
          name="settings"
          iconStyle={{
            alignContent: 'center',
            justifyContent: 'center',
            marginRight: 10,
            marginTop: 10,
            marginBottom: Platform.OS === 'ios' ? 10 : -16,
          }}
          color="white"
          containerStyle={{
            flex: 1,
            marginLeft: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
          }}
          underlayColor="rgba(0,0,0,0.0)"
          onPress={() =>
            NavigationService.navigate('BlockScreen', { settings: true, title: 'Settings' })
          }
        />
      </View>
    );
  };

  Buzz = (token, plate) => {
    this.setState({ disable: true });
    const tokenu = token;
    let body = '';

    try {
      body = JSON.stringify({
        to: tokenu,
        sound: 'default',
        title: 'M-ai BLOCAT!',
        body: plate,
      });
    } catch (err) {
      console.log('Error in buzz stringify', err);
    }

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body,
    });

    this.timer();
  };

  MessageDate = () => {
    const today = new Date();
    const event1 = new Date();
    event1.setHours(today.getHours() + 3);
    const blockingDate = event1.toJSON();
    return blockingDate;
  };

  onPressConversations = Title => {
    if (!global.userId) {
      Alert.alert(
        'Atentie!',
        'Indisponibil fara inregistrare, apasa setari si completeaza un numar de inmatriculare',
        [{ text: 'Inapoi', onPress: () => null }],
        {
          cancelable: false,
        }
      );
    } else {
      NavigationService.navigate('Conversations', { title: Title });
    }
  };

  onPressChat = (content, pk) => {
    if (!global.userId) {
      Alert.alert(
        'Atentie!',
        'Indisponibil fara inregistrare, apasa setari si completeaza un numar de inmatriculare',
        [{ text: 'Inapoi', onPress: () => null }],
        {
          cancelable: false,
        }
      );
    } else {
      this.determineConversationId(pk);
      NavigationService.navigate('MessageScreen', {
        receiverPlateNumber: content,
        receiverId: pk,
        conversationId: this.conversationId,
      });
    }
  };

  timer = () => {
    const date = new Date().toLocaleString();
    const hours = Number(date.slice(11, 13));
    const minutes = Number(date.slice(14, 16));
    const seconds = Number(date.slice(17, 19));
    const time = hours * 3600 + minutes * 60 + seconds + 120;
    AsyncStorage.setItem('time', JSON.stringify(time));

    this.setState({ clear: false });
    this.myInterval = setInterval(() => {
      const { count } = this.state;
      if (count === 0) {
        clearInterval(this.myInterval);
        this.setState({ clear: true, count: 10, disable: false });
      } else {
        this.setState({
          count: count - 1,
          clear: false,
        });
      }
    }, 1000);
  };

  listEmptyComponent = loading => {
    return (
      <View>
        <ListItem
          containerStyle={{ alignContent: 'flex-end', height: height / 2 + 200 }}
          titleStyle={styles.emptyList}
          title="Nu sunt numere de vizualizat momentan"
        />
        {loading ? <ActivityIndicatorBuzz /> : null}
      </View>
    );
  };

  refresh = () => {
    return new Promise(resolve => {
      this.setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  Nointernet = () => {
    const { isConnected } = this.state;
    if (isConnected === false)
      this.dropDownAlertRef.alertWithType('warn', 'Atentie!', 'Nu esti conectat la internet!');
  };

  determineConversationId = pk => {
    const { listConversations } = this.props;
    if (
      listConversations !== undefined &&
      listConversations.allConversationsOfMe !== undefined &&
      listConversations.allConversationsOfMe.userConversations !== undefined
    ) {
      const res = listConversations.allConversationsOfMe.userConversations.findIndex(el =>
        el.associated.find(as => as.user.pk === pk)
      );
      if (res !== -1) {
        this.conversationId =
          listConversations.allConversationsOfMe.userConversations[res].conversation.pk;
      } else {
        this.conversationId = '#';
      }
    }
  };

  render() {
    const { searchQuery, count, clear, Data, disable } = this.state;
    const { listPlateNumbers, onFetchMore } = this.props;

    if (
      listPlateNumbers !== undefined &&
      listPlateNumbers.allPlateNumbers !== undefined &&
      listPlateNumbers.allPlateNumbers.items !== undefined
    ) {
      if (Data.length === 0)
        this.arrayholder = listPlateNumbers.allPlateNumbers.items.filter(
          item => item.pk !== global.userId
        );
      else this.arrayholder = Data.filter(item => item.pk !== global.userId);
    }
    return (
      <SafeAreaView style={styles.container}>
        <Overlay
          overlayStyle={{
            opacity: 0.6,
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          isVisible={!clear}
          fullScreen
        >
          <Progress.Circle
            direction="counter-clockwise"
            thickness={20}
            showsText
            textStyle={{}}
            progress={(10 - count - 1) / 10}
            size={150}
          />
        </Overlay>

        {this.renderHeader()}

        <DropdownAlert
          warnColor="#2089dc"
          imageStyle={{ marginLeft: 20, alignSelf: 'center' }}
          messageStyle={{ fontSize: 18, color: 'white', alignSelf: 'center', marginRight: 10 }}
          titleStyle={{
            fontSize: 20,
            color: 'white',
            alignSelf: 'center',
            marginRight: 60,
            marginBottom: 10,
          }}
          defaultContainer={{
            alignItem: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            height: 76,
            alignSelf: 'center',
            width: '90%',
          }}
          startDelta={90}
          endDelta={108}
          activeStatusBarBackgroundColor="#2089dc"
          closeInterval={1000}
          ref={ref => {
            this.dropDownAlertRef = ref;
          }}
        />
        <FlatList
          contentContainerStyle={{ height: height - 70 }}
          scrollEnabled={!listPlateNumbers.loading}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={this.arrayholder}
          ListEmptyComponent={
            !listPlateNumbers.error ? this.listEmptyComponent(listPlateNumbers.loading) : null
          }
          renderItem={({ item }) => (
            <ListItem
              containerStyle={styles.listItemContainer}
              titleStyle={styles.listItemTitle}
              title={`${item.content_search} `}
              rightElement={
                <View style={styles.buttonsContainer}>
                  <Button
                    title="BUZZ"
                    disabled={disable}
                    containerStyle={{ marginRight: 4 }}
                    onPress={() => {
                      this.Buzz(item.expoToken, item.content_search);
                    }}
                  />
                  <Button
                    title="CHAT"
                    onPress={() => this.onPressChat(item.content_search, item.pk)}
                  />
                </View>
              }
            />
          )}
          keyExtractor={item => item.pk}
          ItemSeparatorComponent={this.renderSeparator}
          refreshing={listPlateNumbers.networkStatus === 4 || listPlateNumbers.loading === 1}
          onRefresh={() => {
            this.Nointernet();
            if (searchQuery === '') listPlateNumbers.refetch();
          }}
          onEndReached={onFetchMore()}
          onEndReachedThreshold={0.5}
        />

        {listPlateNumbers.error && !listPlateNumbers.loading ? (
          <Text
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: '500',
            }}
          >
            ERROR: listPlateNumbers.error
          </Text>
        ) : null}
        {listPlateNumbers.loading && listPlateNumbers.networkStatus !== 4 ? (
          <ActivityIndicatorBuzz />
        ) : null}
      </SafeAreaView>
    );
  }
}

GetOutScreenContainer.propTypes = {
  subscribeToCreatePlateNumber: PropTypes.func.isRequired,
  subscribeToDeletePlateNumber: PropTypes.func.isRequired,
  subscribeToUpdatePlateNumber: PropTypes.func.isRequired,
  subscribeToCreateUserConversations: PropTypes.func.isRequired,

  listPlateNumbers: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.shape({})])
    .isRequired,
  listConversations: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.shape({})])
    .isRequired,
  onFetchMore: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default compose(
  GraphQLOperations.listPlateNumbers,
  GraphQLOperationsMessages.listConversations
)(GetOutScreenContainer);
