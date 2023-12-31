// HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase';
import { User } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './css/HomeScreen';


const HomeScreen = () => {
  const [user, setUser] = useState<User>();
  const [displayName, setDisplayName] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);

  const db = firestore;

  const navigator = useNavigation();
  const goApo = () => {
    // navigator.navigate('ApoScreen' as never);
  };


  // const getFriendsCount = async (uid: string): Promise<number> => {
  //   const friendRef: DocumentReference<DocumentData> = doc(db, `users/${uid}/friends`);
  //   const friendSnapshot = await getDoc(friendRef);
  //   const friendData = friendSnapshot.data();
  //   if (friendData) {
  //     return Object.keys(friendData).length;
  //   } else {
  //     return 0;
  //   }
  // };


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

  const handleChoosePhoto = () => {
    // 画像を選択する処理
  };
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
        <View style={styles.profile}>
          <TouchableOpacity onPress={handleChoosePhoto}>
            {/* <Image source={avatar} style={styles.avatar} /> */}
            <Ionicons name="camera" size={24} color="#666" style={styles.cameraIcon} />
          </TouchableOpacity>
          <Text style={styles.name}>{displayName}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemLabel}>Friends</Text>
            <Text style={styles.infoItemValue}>10</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoItemLabel}>Appointments</Text>
            <Text style={styles.infoItemValue}>5</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={goApo}>
          <Text style={styles.buttonText}>View Appointments</Text>
        </TouchableOpacity>
        <View style={styles.friendList}>
        <Text style={styles.friendListTitle}>友達リスト</Text>
        {/* Add your friend list component here */}
      </View>
      </View>
  );
};

export default HomeScreen;
