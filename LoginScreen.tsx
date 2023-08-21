// LoginScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // ログイン情報を取得する関数
  const getLoginInfo = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      if (email !== null && password !== null) {
        // ログイン情報が存在する場合は、ログイン処理を行う
        try {
              await signInWithEmailAndPassword(auth, email, password);
              const user = await auth.currentUser;
              if (user.displayName === null) {
              saveLoginInfo(email,password);
              navigation.navigate('Setname' as never);
              } else {
              saveLoginInfo(email,password);
              navigation.navigate('Main' as never);
              }
            } catch (error) {
              console.log(error.message);
            }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ログイン情報を保存する関数
const saveLoginInfo = async (email: string, password: string) => {
  try {
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);
  } catch (error) {
    console.log(error);
  }
};

  const handleLogin = async () => {
    // ここでログイン処理を実行し、ログインが成功した場合にメイン画面に遷移する処理を追加する
    // 例えば、ログイン成功時に以下のようにメイン画面に遷移する
    //　今はとりあえずどちらもa
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;
      if (user.displayName === null) {
      saveLoginInfo(email,password);
      navigation.navigate('Setname' as never);
      } else {
      saveLoginInfo(email,password);
      navigation.navigate('Main' as never);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleRegister = () => {
    //mainを治せばおそらく治る
    navigation.navigate('Register' as never);
  }

  useEffect(() => {
    getLoginInfo();
  }
  , []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.RegisterButton} onPress={handleRegister}>
        <Text style={styles.RegisterButtonText}>新規登録はこちらから</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  RegisterButton: {
    marginTop:15,
  },
  RegisterButtonText: {
    color: 'blue',
    fontSize: 15,
    fontWeight: 'bold'
  },
});

export default LoginScreen;
