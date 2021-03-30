import React, { Component } from 'react';
import { AsyncStorage, YellowBox } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
// import Amplify from 'aws-amplify';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import EStyleSheet from 'react-native-extended-stylesheet';
// import awsmobile from './aws-exports';
import _ from 'lodash';
import AWSAppSyncConfig from './aws-appsync-export';
import { GetOutScreen } from './src/screen/GetOutScreen';
import { BlockScreen } from './src/screen/BlockScreen';
import { WelcomeScreen } from './src/screen/WelcomeScreen';
import NavigationService from './src/NavigationService';
import { InitialScreen } from './src/screen/InitialScreen';
import { MessageScreen } from './src/screen/MessageScreen';
import { TestImage } from './src/screen/TestImage';
import { ConversationsScreen } from './src/screen/ConversationsScreen';
import { ActivityIndicatorBuzz } from './src/components/ActivityIndicatorBuzz';

EStyleSheet.build({
  $black: '#5c5c5c',
  $white_fill: '#e8eaed',
  $blue_container: 'rgba(28, 118, 189, 0.4)',
  $normal_blue: '#2089dc',
});

const client = new AWSAppSyncClient({
  url: AWSAppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AWSAppSyncConfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.API_KEY,
    apiKey: AWSAppSyncConfig.aws_appsync_apiKey,

    // type: AUTH_TYPE.AWS_IAM,
    // credentials: () => Auth.currentCredentials(),
    // Note - Testing purposes only
    /* credentials: new AWS.Credentials({
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY
      }) */

    // IAM Cognito Identity using AWS Amplify
    // type: AUTH_TYPE.AWS_IAM,
    // credentials: () => Auth.currentCredentials(),

    // Cognito User Pools using AWS Amplify
    // type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    // jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  },
});

client.initQueryManager();

EStyleSheet.build();

YellowBox.ignoreWarnings(['Setting a timer']);
const newConsole = _.clone(console);
console.warn = message => {
  if (
    message.indexOf('Setting a timer') <= -1 &&
    message.indexOf('Must be on a physical device') <= -1
  ) {
    newConsole.warn(message);
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    // Amplify.configure(awsmobile); // TODO: mobile hub should be redone
    (async () => {
      await this.loading();
      await this.registerForPushNotificationsAsync();
    })();
  }

  loading = async () => {
    try {
      await AsyncStorage.getItem('userId').then(id => {
        const userId = JSON.parse(id);
        global.userId = userId;
        this.setState({ isLoading: false });
      });
    } catch (error) {
      console.log('BlockScreen: error setting up ID in AsyncStorage');
      this.setState({ isLoading: false });
    }
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    const token = await Notifications.getExpoPushTokenAsync();
    global.expoToken = token;
    console.log('Block Screen: Token recieved ', token);
    // POST the token to your backend server from where you can retrieve it to send push notifications.
  };

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return <ActivityIndicatorBuzz />;
    }
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <AppContainer
            ref={navigationRef => {
              NavigationService.setTopLevelNavigator(navigationRef);
            }}
          />
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default App;

const AppSwitchNavigator = createSwitchNavigator(
  {
    InitialScreen: { screen: InitialScreen },
    AuthScreen: createStackNavigator({
      Welcome: { screen: WelcomeScreen },
      BlockScreen: { screen: BlockScreen },
    }),
    MainScreen: createStackNavigator({
      GetOutScreen: { screen: GetOutScreen },
      BlockScreen: { screen: BlockScreen },
      MessageScreen: { screen: MessageScreen },
      Conversations: { screen: ConversationsScreen },
      TestImage: { screen: TestImage },
    }),
  },
  {
    initialRouteName: 'InitialScreen',
  }
);

const AppContainer = createAppContainer(AppSwitchNavigator);
