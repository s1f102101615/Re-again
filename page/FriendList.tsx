import React, { useState } from 'react';
import { Text, TouchableOpacity, Image, StyleSheet, TextInput, View, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FriendModal from './FriendDetail';

function FriendList(props) {
  const { friends } = props;
  const [searchText, setSearchText] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  const filteredFriends = friends.filter((friend) => friend.friend.includes(searchText));

  return (
    <>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="フレンドを検索"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
      </View>
      {filteredFriends.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.request} onPress={() => setSelectedFriend(friend)}>
            {friend['photoURL'] ? (
                <Image source={{ uri: friend['photoURL'] }} style={{ left: '9%', width: 55, height: 55, borderRadius: 40 }}/>
              ) : (
                <Ionicons name="person-circle-outline" style={{ left: '9%' }} size={65} color={'gray'} />
              )}
            <Text style={{ marginLeft: '4%',fontWeight: 'bold', fontSize: 20 }}>{friend['friend']}</Text>
          </TouchableOpacity>
        ))}
        {filteredFriends.length === 0 && (
          <Text style={{ color: 'gray', marginTop:'80%'}}>フレンドはまだいません</Text>
        )}
        <FriendModal selectedFriend={selectedFriend} onClose={() => setSelectedFriend(null)} />
    </>
  );
}

const styles = StyleSheet.create({
    request: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '10%',
      },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
        marginVertical: 10,
      },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
      },
});


export default FriendList;