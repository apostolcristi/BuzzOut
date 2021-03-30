import React from 'react';
import { Dimensions, Platform } from 'react-native';
import ConversationsContainer from './containers/ConversationsContainer';

const ConversationsScreen = () => {
  return <ConversationsContainer userId={global.userId} />;
};

ConversationsScreen.navigationOptions = () => {
  const { width } = Dimensions.get('window');
  return {
    title: 'Conversations',
    headerStyle: {
      backgroundColor: '#2089dc',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: Platform.OS === 'android' ? (width - 10) / 4.5 : 0,
    },
  };
};

export default ConversationsScreen;
