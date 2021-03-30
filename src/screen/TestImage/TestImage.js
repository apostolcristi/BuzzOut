import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, CameraRoll } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RNS3 } from 'react-native-aws3';
import { captureRef as takeSnapshotAsync } from 'react-native-view-shot';
import styles from './style';

class TestImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUri: null,
      topText: '',
      bottomText: '',
    };
  }

  takePic = () => {
    ImagePicker.showImagePicker({}, response => {
      console.log(response);
    });
  };

  // When "Choose" is pressed, we show the user's image library
  // so they may show a photo from disk inside the image view.
  _onChoosePic = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync();
    if (!cancelled) {
      this.setState({ imgUri: uri });
      // console.log(uri) // this logs correctly
      // TODO: why isn't this showing up inside the Image on screen?
    }
  };

  // When "Take" is pressed, we show the user's camera so they
  // can take a photo to show inside the image view on screen.
  _onTakePic = async () => {
    const { cancelled, uri } = await ImagePicker.launchCameraAsync({});
    if (!cancelled) {
      this.setState({ imgUri: uri });
    }
  };

  // When "Save" is pressed, we snapshot whatever is shown inside
  // of "this.imageView" and save it to the device's camera roll.
  _onSave = async () => {
    const uri = await takeSnapshotAsync(this.imageView, {});
    await CameraRoll.saveToCameraRoll(uri);
    // TODO: show confirmation that it was saved (flash the word saved across bottom of screen?)
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Image Picker</Text>

        <Image
          ref={ref => (this.imageView = ref)}
          style={{ width: 300, height: 300, backgroundColor: '#dddddd' }}
          source={{ uri: this.state.imgUri }}
        />

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.button} onPress={this._onChoosePic}>
            <Text style={styles.buttonText}>Choose</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this._onTakePic}>
            <Text style={styles.buttonText}>Take</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this._onSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default TestImage;
