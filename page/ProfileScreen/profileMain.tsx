import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { auth, storage , firestore } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/firestore';
import 'firebase/storage';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref , getDownloadURL,  uploadBytesResumable} from 'firebase/storage';
import styles from './css/profileMain';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';


interface ProfileMainProps {
  route: {
    params: {
      handleLogout: () => void;
    };
  };
}

const ProfileScreen = (props: ProfileMainProps) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [stateView, setStateView] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ふつう');
  const [messageView, setMessageView] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [status, setStatus] = useState('ふつう');
  const [message, setMessage] = useState('');

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

  const stateset = async (status:string) => {
    setStateView(!stateView);
    // statusをfirestoreに保存
    const userRef = doc(firestore, 'users', user.uid);
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      updateDoc(userRef, {
        status: status,
      });
    } else {
      setDoc(userRef, {
        status: status,
      });
    }    
    setStatus(status);
  };

  const messageset = async (message:string) => {
    setMessageView(!messageView);
    // statusをfirestoreに保存
    const userRef = doc(firestore, 'users', user.uid);
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      updateDoc(userRef, {
        message: message,
      });
    } else {
      setDoc(userRef, {
        message: message,
      });
    }
    setSelectedMessage('');
    setMessage(message);
  };

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
  }, [firestore,userPhotoURL,status,message]);

  // ユーザーのプロフィール画像を取得
  const fetchUserPhotoURL = async ( uid :string ) => {
    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData && userData.photoURL) {
        setUserPhotoURL(userData.photoURL);
      }
      if (userData && userData.status) {
        setStatus(userData.status);
      }
      if (userData && userData.message) {
        setMessage(userData.message);
      }
    }
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
      {/* stateViewがtrueになったらmodalを作成する */}
      <Modal
          transparent={true}
          visible={stateView}
          onRequestClose={() => {
            setStateView(false);
          }}
        >
        <View style={styles.modal}>
          <View style={styles.modalcontent}>
            <Text style={styles.modaltext}>忙しさを変更しますか？</Text>
            {/* selectでステータスを選択する */}
            <Picker
              selectedValue={selectedStatus}
              style={{ top:-50,height: 120, width: 150 }}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            >
              <Picker.Item label="とても" value="とても" />
              <Picker.Item label="まあまあ" value="まあまあ" />
              <Picker.Item label="ふつう" value="ふつう" />
              <Picker.Item label="ちょっと" value="ちょっと" />
              <Picker.Item label="ぜんぜん" value="ぜんぜん" />
            </Picker>
            {/* ボタンを押したらステータスを変更する */}
            <View style={styles.modalbutton}>
              <TouchableOpacity style={styles.modalbutton2} onPress={()=> { stateset(selectedStatus) }} >
                <Text style={styles.modalbuttontext}>変更</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalbutton1} onPress={()=> { setStateView(false)}} >
                <Text style={styles.modalbuttontext}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* メッセージ変更 */}

      <Modal
          transparent={true}
          visible={messageView}
          onRequestClose={() => {
            setMessageView(false);
          }}
        >
        <View style={styles.modal}>
          <View style={styles.modalcontent}>
            <Text style={styles.modaltext}>ステータスメッセージを変更しますか？</Text>
            {/* ゆーざーがメッセージを入力できるようにする */}
            <TextInput
              style={styles.input}
              placeholder="ステータスメッセージを入力してください"
              onChangeText={(value) => setSelectedMessage(value)}
              value={selectedMessage}
            />

            {/* ボタンを押したらステータスを変更する */}
            <View style={styles.modalbutton}>
              <TouchableOpacity style={styles.modalbutton2} onPress={()=> { messageset(selectedMessage) }} >
                <Text style={styles.modalbuttontext}>変更</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalbutton1} onPress={()=> { setMessageView(false)}} >
                <Text style={styles.modalbuttontext}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      

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
          <Text style={ styles.statusMessage }>{message}</Text>
          <View style={styles.availability}>
            {/* statusの忙しさによって色を変えたい */}
            <Ionicons name='time-outline' size={20} color={status === 'ぜんぜん' ? 'green' : status === 'ちょっと' ? '#b8d200' :
          status === 'ふつう' ? 'yellow' : status === 'まあまあ' ? 'orange' : status === 'とても' && 'red' } style={styles.availabilityIcon} />
            <Text style={styles.availabilityText}>{status}</Text>
          </View>
        </View> 
        <View style={styles.profileedit} >
          <TouchableOpacity style={styles.item} onPress={pickImage}>
            <Icon name="id-badge" size={35} color="black" />
            <Text style={styles.label}>アイコン変更</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Icon name="handshake-o" size={35} color="black" onPress={()=> { setMessageView(!messageView); }} />
            <Text style={styles.label}>メッセージ変更</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={()=> { setStateView(!stateView); }}>
            {/* ステータスっぽいアイコン */}
            <Ionicons name="man" size={35} color="green" />
            <Text style={styles.label}>ステータス</Text>
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
          <TouchableOpacity style={styles.settingitem} onPress={props.route.params.handleLogout}>
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

export default ProfileScreen;
