import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import NavigationService from '../../NavigationService';
import { ActivityIndicatorBuzz } from '../../components/ActivityIndicatorBuzz';

class InitialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.arrayHolder = [];
  }

  componentDidMount() {
    this.loading();
    StatusBar.setHidden(false);
  }

  componentDidUpdate() {
    this.switchScreen();
  }

  loading = () => {
    this.setState({ isLoading: false });
  };

  switchScreen = () => {
    const { isLoading } = this.state;
    if (!isLoading && global.userId) {
      NavigationService.navigate('GetOutScreen');
    } else {
      NavigationService.navigate('AuthScreen', { settings: true });
    }
  };

  static navigationOptions = {
    header: null,
  };

  render() {
    return <ActivityIndicatorBuzz />;
  }
}

export default InitialScreen;
