// ProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, onAuthStateChanged, signOut } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  const handleLogout = () => {
    auth.signOut(auth)
      .then(() => {
        console.log('logout');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <View>
    <Text>ホーム画面</Text>
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        marginTop: 10,
        padding: 10,
        backgroundColor: '#88cb7f',
        borderRadius: 10,
        width: 100,
      }}
    >
      <Text style={{ color: 'white' }}>ログアウト</Text>
    </TouchableOpacity>
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

export default ProfileScreen;
