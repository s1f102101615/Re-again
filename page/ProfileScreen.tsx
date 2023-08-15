// ProfileScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.displayName || '');
      } else {
        setUser('');
      }
    });
    return () => unsubscribe();
  }, []);
  
  // ログアウト処理
const handleLogout = () => {
  auth.signOut()
    .then(() => {
      console.log('logout');
      navigation.navigate('Login');
    })
    .catch((error) => {
      console.log(error.message);
    });
};
  const displayName = user || '未定義';

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
        <View style={{ alignItems: 'center', marginTop:'10%', marginBottom:'6%' }}>
          <Icon name="user" size={80} color="black" />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>{displayName}</Text>
        </View>
        <View style={styles.profileedit}>
        <TouchableOpacity style={styles.item}>
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

      <TouchableOpacity style={{ alignItems:'center', marginTop: '4%' }}>
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
        <TouchableOpacity style={styles.settingitem}>
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
