import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';
import { updateProfile } from 'firebase/auth';

const SetnameScreen = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');

  const handleSave = async () => {
    const user = await auth.currentUser;
    await updateProfile(user, {
        displayName: displayName,
      });
      navigation.navigate('Main');
  };

  return (
    <View>
      <Text>Set Name Screen</Text>
      <TextInput
        placeholder="Display Name"
        onChangeText={setDisplayName}
        value={displayName}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default SetnameScreen;