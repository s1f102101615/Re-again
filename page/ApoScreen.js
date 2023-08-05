// ApoScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ApoScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Apo Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApoScreen;
