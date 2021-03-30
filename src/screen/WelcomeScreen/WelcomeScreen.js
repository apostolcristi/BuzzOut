import React, { Component } from 'react';
import { View, Image, Dimensions, Text, Button } from 'react-native';
import NavigationService from '../../NavigationService';
import styles from './style';

const { width, height } = Dimensions.get('window');

const logo = require('../../assets/images/logo(2).png');

class WelcomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={[styles.container, { width, height }]}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>What do you want to do ?</Text>
          <Text />
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            style={styles.blockButton}
            title="Block"
            onPress={() => NavigationService.navigate('BlockScreen', { settings: false })}
          />
          <Text> </Text>
          <Button title="Get out" onPress={() => NavigationService.navigate('GetOutScreen')} />
        </View>
      </View>
    );
  }
}

export default WelcomeScreen;
