import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import styles from './style';

const ActivityIndicatorBuzz = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="rgba(28, 118, 189, 0.4)" />
    </View>
  );
};

export default ActivityIndicatorBuzz;
