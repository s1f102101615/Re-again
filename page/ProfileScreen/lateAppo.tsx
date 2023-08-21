// HomeScreen.js

import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, firebase, firestore } from '../../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { User } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const [user, setUser] = useState<User>();
  const [displayName, setDisplayName] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);

  const db = firestore;

  const navigator = useNavigation();
 


  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // const count = await getFriendsCount(user.uid);
        setFriendsCount(3);
      } else {
        setUser(undefined);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);


  return (
    <View style={styles.container}>
        <Text>過去の約束</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    width:'100%',
  },
});

export default HomeScreen;
