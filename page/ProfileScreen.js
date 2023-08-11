// ProfileScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [user, setUser] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user.displayName);
      } else {
        setUser('');
      }
    });
    return () => unsubscribe();
  }, []);
  
  const handleLogout = () => {
    auth.signOut(auth)
      .then(() => {
        console.log('logout');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const displayName = user || '未定義';
  return (
    <View style={styles.container}>
      <View>
        <View style={{ alignItems: 'center', marginTop:'10%', marginBottom:'5%' }}>
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
      <TouchableOpacity style={{ alignItems:'center', marginTop: '4%', marginBottom: '4%' }}>
        <View style={styles.post}>
          <Text><Icon name="list-alt" size={15} color='blue' /> 過去の約束一覧 <Icon name="angle-right" size={15} color="black" /></Text>
        </View>
      </TouchableOpacity>
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
    marginTop: 20,
  },
  settinglist: {
    flexDirection: 'row', // 要素を横に並べる
    justifyContent: 'space-between', // 要素間のスペースを均等に分配
    paddingHorizontal: '1%', // 左右のパディング
    alignItems: 'center', // 縦方向に中央揃え
    marginTop: 4,
    flexWrap: 'wrap', // 要素数が超えると改行
    marginTop: '4%',
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
