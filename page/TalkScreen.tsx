import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TalkRoom = {
  id: number;
  name: string;
};

const TalkScreen = ({ navigation }) => {
  const [talkRooms, setTalkRooms] = useState<TalkRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  //仮設置

  useEffect(() => {
    // トークルームのリストを取得するAPIを呼び出す
    // 取得したトークルームのリストを setTalkRooms で設定する
    const talkRooms: TalkRoom[] = [
      { id: 1, name: 'トークルーム1' },
      { id: 2, name: 'トークルーム2' },
      { id: 3, name: 'トークルーム3' },
    ];
    setTalkRooms(talkRooms);
  }, []);

  const handlePress = (item: TalkRoom) => {
    navigation.navigate('TalkRoomDetail', { talkRoom: item });
  };

  const renderItem = ({ item }: { item: TalkRoom }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={talkRooms}
        style={styles.contain}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.circleContainer} >
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.circle}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height:'100%',
    width:'100%',
  },
  contain: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 100,
    width: '90%',
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  circle: {
    backgroundColor: '#00FF7F',
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'absolute',
    bottom: '7%',
    right: 20,
    zIndex: 2,
  },
});

export default TalkScreen;