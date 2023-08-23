import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth, storage , firestore } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/firestore';
import 'firebase/storage';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref , getDownloadURL , uploadBytes, uploadBytesResumable} from 'firebase/storage';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  // 過去の約束に遷移
    const gotolate = () => {
        navigation.navigate('過去の約束' as never);
    };
    
  //ヘッダー消去
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserPhotoURL(user.uid);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [firestore,userPhotoURL]);

  // ユーザーのプロフィール画像を取得
  const fetchUserPhotoURL = async ( uid :string ) => {
    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData && userData.photoURL) {
        setUserPhotoURL(userData.photoURL);
      }
    }
  };
 
  
  // ログアウト処理
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.navigate('Login' as never);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // 設定画面に遷移
  const handleSetting = () => {
    navigation.navigate('setting' as never);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('メディアライブラリへのアクセス許可が必要です');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log(result.assets[0].uri);
  
      // 画像をFirebase Storageにアップロード
      const imageRef = ref(storage, `userImages/${user.uid}`);
      
  
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
  
        const metadata = {
          contentType: 'image/jpeg', // 画像の種類に合わせて調整
        };
  
        await uploadBytesResumable(imageRef, blob, metadata);
  
        // Firestoreに画像URLを保存
        const downloadURL = await getDownloadURL(imageRef);
        console.log(user.uid);
        const userRef = doc(firestore, 'users', user.uid);
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          await updateDoc(userRef, {
            photoURL: downloadURL,
          });
        } else {
          await setDoc(userRef, {
            photoURL: downloadURL,
          });
        }
      } catch (error) {
        console.log(error);
        alert('画像のアップロードに失敗しました');
      }
      fetchUserPhotoURL(user.uid);
    }
  };

  const displayName = user ? user.displayName : '未定義';
  return (
    <View style={styles.container}>
      <View>
        <View style={{ alignItems: 'center', marginTop:'10%', marginBottom:'6%' }}>
          {userPhotoURL ? (
            <Image source={{ uri: userPhotoURL }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          ) : (
            <Icon name="user" size={80} color="black" />
          )}
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>{displayName}</Text>
        </View>
        <View style={styles.profileedit} >
          <TouchableOpacity style={styles.item} onPress={pickImage}>
            <Icon name="id-badge" size={35} color="black" />
            <Text style={styles.label}>アイコン変更</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Icon name="handshake-o" size={35} color="black" />
            <Text style={styles.label}>友達一覧</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Icon name="google-plus-official" size={35} color="black" />
            <Text style={styles.label}>Googleさん</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ alignItems:'center', marginTop: '4%' }} onPress={()=> { gotolate() } }>
          <View style={styles.post}>
            <Text><Icon name="list-alt" size={15} color='blue' /> 過去の約束一覧 <Icon name="angle-right" size={15} color="black" /></Text>
          </View>
        </TouchableOpacity>

        <View style={styles.postdouble}>
          <TouchableOpacity style={styles.box1}>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box2}>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{ fontSize:20, marginLeft:'5%', fontWeight:'bold' }}>ユーザー設定</Text>
        </View> 

        <View style={styles.settinglist}>
          <TouchableOpacity style={styles.settingitem} onPress={handleSetting}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem} onPress={handleLogout}>
            <Icon name="sign-out" size={35} color="black" />
            <Text style={styles.label}>ログアウト</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingitem}>
            <Icon name="cog" size={35} color="black" />
            <Text style={styles.label}>設定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',     
  },
  profileedit: {
    flexDirection: 'row', // 要素を横に並べる
    justifyContent: 'space-between', // 要素間のスペースを均等に分配
    paddingHorizontal: '15%', // 左右のパディング
    alignItems: 'center', // 縦方向に中央揃え
    marginTop: '4%',
  },
  postdouble: { 
    flexDirection: 'row', // 要素を横に並べる
    justifyContent: 'space-between', // 要素間のスペースを均等に分配
    paddingHorizontal: '5%', // 左右のパディング
    marginTop: '3%',
    height: '15%', 
    marginBottom: '3%', 
  },
  settinglist: {
    flexDirection: 'row', // 要素を横に並べる
    justifyContent: 'space-between', // 要素間のスペースを均等に分配
    paddingHorizontal: '1%', // 左右のパディング
    alignItems: 'center', // 縦方向に中央揃え
    flexWrap: 'wrap', // 要素数が超えると改行
    marginTop: '3%',
  },
  item: {
    alignItems: 'center',
  },
  settingitem: {
    alignItems: 'center',
    width: '25%',
    height: '52%',
  },
  label: {
    fontSize: 12,
    marginTop: 8,
  },
  box1: {
    width: '49 %',
    height: '100%',
    backgroundColor: '#00FF00',
    borderRadius: 10,
  },
  box2: {
    width: '48%',
    height: '100%',
    backgroundColor: '#6A5ACD',
    borderRadius: 10,
  },
  post: {
    // 100%の大きさ
    width: '90%',
    height: 40,
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
