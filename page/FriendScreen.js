import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import { doc, deleteDoc, collection, addDoc, getDocs, query, where, onSnapshot, collectionGroup } from 'firebase/firestore';

const FriendScreen = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // フレンド申請を受け取る処理 
    const user = auth.currentUser;
    const q = query(collection(firestore, `users/${user.uid}/gotRequests`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ ...doc.data(), id: doc.id });
      });
      setFriendRequests(requests); // 新しい配列を作成して、それをfriendRequestsに設定する
    });
    return () => unsubscribe();
  }, []);

  const handleAccept = async (request) => {
    // フレンド申請を承認する処理
    const user = auth.currentUser;
    const enemy = await getUserUidByDisplayName(request.gotRequest);
    if (enemy !== null) {
      try {
        const docRef = await addDoc(collection(firestore, `users/${user.uid}/friends`), {
          friend: request.gotRequest
        });
        const doRef = await addDoc(collection(firestore, `users/${enemy}/friends`), {
          friend: user.displayName
        });
        await deleteDoc(doc(firestore, `users/${user.uid}/gotRequests/${request.id}`));
        const sentRequestsRef = collection(firestore, `users/${enemy}/sentRequests`);
        const sentRequestsQuery = query(sentRequestsRef, where('sendRequest', '==', user.displayName));
        const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
        sentRequestsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    } else {
      console.log('ユーザーが見つかりませんでした。');
    }
  };

  const handleReject = async (request) => {
    // フレンド申請を拒否する処理
    const user = auth.currentUser;
    const enemy = await getUserUidByDisplayName(request.gotRequest);
    if (enemy !== null) {
      try {
        await deleteDoc(doc(firestore, `users/${user.uid}/gotRequests/${request.id}`));
        const sentRequestsRef = collection(firestore, `users/${enemy}/sentRequests`);
        const sentRequestsQuery = query(sentRequestsRef, where('sendRequest', '==', user.displayName));
        const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
        sentRequestsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } catch (e) {
        console.error('Error adding document: ', e);
      } 
    } else {
      console.log('ユーザーが見つかりませんでした。');
    }
  };

const getUserUidByDisplayName = async (displayName) => {
  //displayNameからuserのuidを取得する処理
  const q = query(collectionGroup(firestore, 'profile'), where('displayName', '==', displayName.trim()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  } else {
    const user = querySnapshot.docs[0].ref.parent.parent.id;
    return user;
  }
};

const handleSave = async () => {
  //フレンド申請を送る処理 
  const user = auth.currentUser;
  const enemy = await getUserUidByDisplayName(name);
  if (enemy !== null) {
    const sentRequestsRef = collection(firestore, `users/${user.uid}/sentRequests`);
    const sentRequestsQuery = query(sentRequestsRef, where('sendRequest', '==', name));
    const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
    if (sentRequestsSnapshot.size > 0) {
      setMessage(`すでに ${name} にフレンド申請を送っています。`);
    } else {
      try {
        const docRef = await addDoc(collection(firestore, `users/${user.uid}/sentRequests`), {
          sendRequest: name
        });
        const doRef = await addDoc(collection(firestore, `users/${enemy}/gotRequests`), {
          gotRequest: user.displayName
        });
        setMessage(`${name} にフレンド申請を送りました!`);
      } catch (e) {
        setMessage('フレンド申請に失敗しました。');
      }
    }
  } else {
    setMessage('ユーザーが見つかりませんでした。');
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