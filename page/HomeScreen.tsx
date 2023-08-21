// HomeScreen.js

import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, firebase, firestore } from '../firebase';
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
  //   <View style={styles.container}>
  //   <View>
  //     <View style={{ alignItems: 'center', marginTop: '10%', marginBottom: '6%' }}>
  //       <Icon name="user" size={80} color="black" />
  //     </View>
  //     <View style={{ alignItems: 'center' }}>
  //       <Text style={{ fontSize: 20 }}>{displayName}</Text>
  //       <Text style={{ fontSize: 16 }}>友達の数: {friendsCount}</Text>
  //     </View>
  //   </View>
  // </View>
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
  profile: {
    flexDirection: 'row',
    marginBottom: 14,
    marginLeft: 34,
    marginTop: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 18,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 16,
  },
  info: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    marginRight: 16,
  },
  infoItemLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
