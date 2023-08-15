import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

type TalkRoom = {
  id: number;
  name: string;
};

const TalkScreen = () => {
  const [talkRooms, setTalkRooms] = useState<TalkRoom[]>([]);

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

  const renderItem = ({ item }: { item: TalkRoom }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={talkRooms}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default TalkScreen;