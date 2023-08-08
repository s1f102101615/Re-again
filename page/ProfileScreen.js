// ProfileScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.displayName);
      } else {
        setUser('');
      }
    });
    return () => unsubscribe();
  }, []);
  
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
  const displayName = user || '未定義';
  return (
    <View>
    <Text>ホーム画面</Text>
    <Text>a{displayName}</Text>
    
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
