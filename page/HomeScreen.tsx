// HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, firebase, firestore } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { User } from 'firebase/auth';
import { DocumentData, DocumentReference, collection, doc, getDoc } from 'firebase/firestore';

const HomeScreen = () => {
  const [user, setUser] = useState<User>();
  const [displayName, setDisplayName] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);

  const db = firestore;

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
    <View>
      <View style={{ alignItems: 'center', marginTop: '10%', marginBottom: '6%' }}>
        <Icon name="user" size={80} color="black" />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{displayName}</Text>
        <Text style={{ fontSize: 16 }}>友達の数: {friendsCount}</Text>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendsCount: {
    fontSize: 16,
  },
});

export default HomeScreen;
