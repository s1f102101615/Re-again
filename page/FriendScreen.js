// FriendScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FriendScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Friend欄</Text>
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

export default FriendScreen;
