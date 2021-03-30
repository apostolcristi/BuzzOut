import React from 'react';
import { Platform, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import BlockScreenContainer from './containers/BlockScreenContainer';

const BlockScreen = props => {
  const { navigation } = props;
  return (
    <BlockScreenContainer
      userId={global.userId ? global.userId : '#'}
      expoToken={global.expoToken}
      navigation={navigation.state.params.settings}
    />
  );
};

BlockScreen.navigationOptions = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  return {
    title: navigation.getParam('title', 'BlockScreen'),
    headerStyle: {
      backgroundColor: '#2089dc',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 20,
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginRight: Platform.OS === 'android' ? (width - 10) / 4.5 : 0,
    },
  };
};

BlockScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.shape({})])
    .isRequired,
};
export default BlockScreen;
