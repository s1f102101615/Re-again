import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase';
import { doc, deleteDoc, collection, addDoc, getDocs, query, where, onSnapshot, collectionGroup } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const FriendScreen = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [friendRequests, setFriendRequests] = React.useState([]);
  const [friends, setFriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');

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

  useEffect(() => {
    // フレンドを取得する処理
    const user = auth.currentUser;
    const f = query(collection(firestore, `users/${user.uid}/friends`));
    const listfriend = onSnapshot(f, (querySnapshot) => {
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push({ ...doc.data(), id: doc.id });
      });
      setFriends(friends); // 新しい配列を作成して、それをfriendsに設定する
    });
    return () => {
      listfriend();
    };
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

const alreadyFriend = async (displayName) => {
  //displayNameがフレンドかを判定する処理
  const user = auth.currentUser;
  const q = query(collection(firestore, `users/${user.uid}/friends`), where('friend', '==', displayName.trim()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log('いないよ')
    return false;
  } else {
    console.log('いるよ')
    return true;
  }
};

const handleTabPress = (tab) => {
  setActiveTab(tab);
};

const handleSave = async () => {
  //フレンド申請を送る処理 
  const user = auth.currentUser;
  const enemy = await getUserUidByDisplayName(name);
  if (await alreadyFriend(name)) {
    setMessage('すでにフレンドです。');
  } else {
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
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => handleTabPress('friends')}
        >
          <Text style={styles.tabText}>フレンド</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => handleTabPress('requests')}
        >
            {friendRequests.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{friendRequests.length}</Text>
              </View>
            )}
          <Text style={styles.tabText}>フレンドリクエスト</Text>
        </TouchableOpacity>
      </View>
      {/* フレンド欄 */}
      {activeTab === 'friends' && (
      <>
        <Text>フレンド欄</Text>
        {friends.map((friend) => (
          <View key={friend.id} style={styles.request}>
            <Text>{friend.friend}</Text>
          </View>
        ))}
        {friends.length === 0 && (
          <Text>フレンドはまだいません...</Text>
        )}
      </>
      )}
      {/* フレンドリクエスト欄 */}
      {activeTab === 'requests' && (
      <>
        <Text>Friend Requests</Text>
        {friendRequests.map((request) => (
          <View key={request.id} style={styles.request}>
            <Text>{request.gotRequest}からフレンド申請が来ています。</Text>
            <Button title="Accept" onPress={() => handleAccept(request)} />
            <Button title="Reject" onPress={() => handleReject(request)} />
          </View>
        ))}
        {friendRequests.length === 0 && (
          <Text>フレンド申請はありません。</Text>
        )}
      </>
      )}
      {/* フレンドリクエストアイコン */}
      <View style={styles.circleContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.circle}>
              <Ionicons name="person-add" size={32} color="#fff" />
            </View>
        </TouchableOpacity>
      </View>
    {/* フレンドリクエストを送信する */}
    <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>フレンドリクエスト送信</Text>
            <TextInput
              style={styles.input1}
              onChangeText={setName}
              placeholder="フレンドの名前"
            />
            <Text>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>送信</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    width: '80%',
  },
  input1: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    width: 230,
  },
  request: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
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
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#00FF7F',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000000',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 45,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#7f5df0',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabBadge: {
    position: 'absolute',
    top: 5,
    right: 3,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendScreen;