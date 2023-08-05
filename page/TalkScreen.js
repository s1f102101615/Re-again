// TalkScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TalkScreen = () => {
  return (
    <View style={styles.container}>
      <Text>トーク画面</Text>
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

export default TalkScreen;
