import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, firestore } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const TalkRoomMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { talkroomId } = route.params as { talkroomId: string };

  const handleSignOut = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const { uid } = user;
    const userRef = doc(firestore, 'users', uid);
    await updateDoc(userRef, { talkroomId: null });
    navigation.navigate('List' as never);
  };

  const handleNotificationToggle = (value: boolean) => {
    console.log('Notification toggle value:', value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知</Text>
        <Switch onValueChange={handleNotificationToggle} value={false} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>トークルームから退出する</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TalkRoomMenu;