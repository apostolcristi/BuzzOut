import React from 'react';
import { Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';
import MessagesContainer from './containers/MessagesContainer';

const MessageScreen = props => {
  const { navigation } = props;
  return (
    <MessagesContainer
      receiverPlateNumber={navigation.state.params.receiverPlateNumber}
      receiverId={navigation.state.params.receiverId}
      conversationId={navigation.state.params.conversationId}
      userId={global.userId ? global.userId : '#'}
    />
  );
};

MessageScreen.navigationOptions = ({ navigation }) => {
  const { width } = Dimensions.get('window');

  return {
    title: navigation.getParam('receiverPlateNumber', 'nonim'),
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
      marginRight: Platform.OS === 'android' ? (width - 10) / 5 : 0,
    },
  };
};

MessageScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        userId: PropTypes.string,
        conversationId: PropTypes.string,
        receiverId: PropTypes.string.isRequired,
        receiverPlateNumber: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
export default MessageScreen;
