import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';
import { updateProfile } from 'firebase/auth';

const SetnameScreen = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  // ヘッダーの左側のボタンを消す
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);
  
  // ユーザー名を設定する処理
  const handleSave = async () => {
    const user = await auth.currentUser;
    await updateProfile(user, {
        displayName: displayName,
      });
      navigation.navigate('Main');
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
    </KeyboardAvoidingView>
  );
};

export default SetnameScreen;