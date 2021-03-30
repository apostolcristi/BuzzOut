import React from 'react';
import GetOutScreenContainer from './containers/GetOutScreenContainer';

const GetOutScreen = () => {
  return <GetOutScreenContainer userId={global.userId ? global.userId : '#'} />;
};

GetOutScreen.navigationOptions = {
  header: null,
};

GetOutScreen.propTypes = {};

export default GetOutScreen;
