// HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const [user, setUser] = useState('');
  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.displayName || '');
      } else {
        setUser('');
      }
    });
    return () => unsubscribe();
  }, []);
  const displayName = user || '未定義';

    // プロフィールアイコンを変更する処理
  // const handleChoosePhoto = () => {
  //   const options = {
  //     noData: true,
  //   };
  //   ImagePicker.launchImageLibrary(options, response => {
  //     if (response.uri) {
  //       // 画像をアップロードするAPIを呼び出す
  //       // アップロードが完了したら、setAvatarで新しいアバターを設定する
  //       setAvatar(response);
  //     }
  //   });
  // };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <View>
      <View style={{ alignItems: 'center', marginTop:'10%', marginBottom:'6%' }}>
        <Icon name="user" size={80} color="black" />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{displayName}</Text>
      </View>
      </View>
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

export default HomeScreen;
