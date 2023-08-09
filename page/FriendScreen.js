import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, collectionGroup } from 'firebase/firestore';

const FriendScreen = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    //gotRequest
    const user = auth.currentUser;
    const q = query(collection(firestore, `users/${user.uid}/gotRequests`), where('gotRequest', '==', user.displayName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ ...doc.data(), id: doc.id });
      });
      setFriendRequests(requests);
    }
    );
    console.log(friendRequests);
    return () => unsubscribe();
  }, []);



const getUserUidByDisplayName = async (displayName) => {
  //displayNameからuserのuidを取得する処理
  const q = query(collectionGroup(firestore, 'profile'), where('displayName', '==', displayName.trim()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log('No matching documents found.');
    return null;
  } else {
    console.log('No maents found.');
    const user = querySnapshot.docs[0].ref.parent.parent.id;
    return user;
  }
};

  const handleSave = async () => {
    //フレンド申請を送る処理
    const user = auth.currentUser;
    const enemy = await getUserUidByDisplayName(name);
    if (enemy !== null) {
    try {
      const docRef = await addDoc(collection(firestore, `users/${user.uid}/sentRequests`), {
        sendRequest: name
      });
      const doRef = await addDoc(collection(firestore, `users/${enemy}/gotRequests`), {
        gotRequest: user.displayName
      });
      console.log('Document written with ID: ', docRef.id);
      setMessage('Friend request sent!');
    } catch (e) {
      console.error('Error adding document: ', e);
      setMessage('Failed to send friend request.');
    }
  } else {
    console.log('そんな人いません。')
  }
  };
  

  return (
    <View style={styles.container}>
      <Text>Friend欄</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Enter friend's UID"
      />
      <Button title="Send friend request" onPress={handleSave} />
      <Text>{message}</Text>
      <Text>Friend Requests</Text>
      {friendRequests.map((request) => (
        <View key={request.id} style={styles.request}>
          <Text>{request.gotRequest} sent you a friend request.</Text>
          <Button title="Accept" onPress={() => handleAccept(request)} />
          <Button title="Reject" onPress={() => handleReject(request)} />
        </View>
      ))}
      {friendRequests.length === 0 && (
        <Text>You have no friend requests.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    width: '80%',
  },
});

export default FriendScreen;