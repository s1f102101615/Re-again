import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from './firebase';
import { updateProfile } from 'firebase/auth';
import { collectionGroup, collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';


const SetnameScreen = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  // ヘッダーの左側のボタンを消す
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);
  
  const saveUser = async (user) => {
    const profileRef = collection(firestore, `users/${user.uid}/profile`);
    const docRef = await addDoc(profileRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
    console.log("Document written with ID: ", docRef.id);
  };

  const getUserByDisplayName = async (displayName) => {
    //同じ名前がいるか確かめる関数
    const querySnapshot = await getDocs(query(collectionGroup(firestore, 'profile'), where('displayName', '==', displayName.trim())));
    if (querySnapshot.empty) {
      return false;
    }
    return true;
  };

  // ユーザー名を設定する処理
  const handleSave = async () => {
    const user = await auth.currentUser;
    const existingUser = await getUserByDisplayName(displayName); // displayNameが既に存在するかどうかを確認する
    if (existingUser) {
      setMessage('この名前は既に使用されています');
      return;
    }
    await updateProfile(user, {
      displayName: displayName,
    });
    try {
      await saveUser(user);
      navigation.navigate('Main');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView
        behavior="padding"
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 20 }}>ユーザーネーム設定</Text>
        <View style={{ marginBottom: 20 }}>
        <TextInput
            style={{
            width: 250,
            borderWidth: 1,
            padding: 5,
            borderColor: 'gray',
            }}
            onChangeText={setDisplayName}
            value={displayName}
            placeholder="名前を入力してください"
            autoCapitalize="none"
            autoCorrect={false}
        />
        </View>
      <Button title="決定" onPress={handleSave} />
      <Text>{message}</Text>
    </KeyboardAvoidingView>
  );
};

export default SetnameScreen;