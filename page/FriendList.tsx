import React from 'react';
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function FriendList(props) {
  const { friends } = props;

  return (
    <>
      {friends.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.request}>
            {friend['photoURL'] ? (
                <Image source={{ uri: friend['photoURL'] }} style={{ left: '9%', width: 55, height: 55, borderRadius: 40 }}/>
              ) : (
                <Ionicons name="person-circle-outline" style={{ left: '9%' }} size={65} color={'gray'} />
              )}
            <Text style={{ marginLeft: '4%',fontWeight: 'bold', fontSize: 20 }}>{friend['friend']}</Text>
          </TouchableOpacity>
        ))}
        {friends.length === 0 && (
          <Text style={{ color: 'gray', marginTop:'80%'}}>フレンドはまだいません</Text>
        )}
    </>
  );
}

const styles = StyleSheet.create({
    request: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '10%',
        borderBottomWidth: 0.5,
      },
});


export default FriendList;