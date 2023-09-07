import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase';
import { Image } from 'react-native';
import { doc, deleteDoc, collection, addDoc, getDocs, query, where, onSnapshot, collectionGroup, DocumentData, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import FriendList from './FriendList';
import styles from './css/FriendScreen';
import FriendModal from './FriendDetail';
import QRCode from 'react-native-qrcode-svg';



const FriendScreen = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [friendRequests, setFriendRequests] = React.useState<{ id:string; photoURL: string ;status:string; message:string}[]>([]);
  const [friends, setFriends] = useState<{ id:string;photoURL: string ;status:string; message:string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  
  const user = auth.currentUser;

  useEffect(() => {
    // フレンド申請を受け取る処理 
    const user = auth.currentUser;
    if (!user){
      return;
    }
    const q = query(collection(firestore, `users/${user.uid}/gotRequests`));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const requests:{ id:string , photoURL: string, status:string , message:string}[] = [];
      for (const doco of querySnapshot.docs) {
        const requestData = doco.data();
        const requestUid = requestData.gotRequestuid;
        const userRef = doc(firestore, 'users', requestUid);
        const userDoc = await getDoc(userRef);
        const photoURL = userDoc.get('photoURL');
        const status = userDoc.get('status');
        const message = userDoc.get('message');
        requests.push({ ...requestData, id: doco.id, photoURL, status, message });
      }
      setFriendRequests(requests); // 新しい配列を作成して、それをfriendRequestsに設定する
      console.log(requests)
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    // フレンドを取得する処理
    const user = auth.currentUser;
    if (!user){
      return;
    } 
    const f = query(collection(firestore, `users/${user.uid}/friends`));

    const listfriend = onSnapshot(f, async (querySnapshot) => {
      const friends:{ id:string, photoURL: string,status:string , message:string }[] = [];
      for (const doco of querySnapshot.docs) {
        const friendData = doco.data();
        const friendUid = friendData.frienduid;
        const userRef = doc(firestore, 'users', friendUid);
        const userDoc = await getDoc(userRef);
        const photoURL = userDoc.get('photoURL');
        const status = userDoc.get('status');
        const message = userDoc.get('message');
        friends.push({ ...friendData, id: doco.id, photoURL, status, message });
      }
      setFriends(friends); // 新しい配列を作成して、それをfriendsに設定する
    });
    return () => {
      listfriend();
    };
  }, []);

  const handleAccept = async (request) => {
    // フレンド申請を承認する処理
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const enemy = request['gotRequestuid'];
    console.log(enemy)
    if (enemy !== null) {
      try {
        const docRef = await addDoc(collection(firestore, `users/${user.uid}/friends`), {
          friend: request.gotRequest,
          frienduid: request.gotRequestuid,
          friendicon: request.getRequesticon,
        });
        const doRef = await addDoc(collection(firestore, `users/${enemy}/friends`), {
          friend: user.displayName,
          frienduid: user.uid,
          friendicon: user.photoURL,
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
    if (!user) {
      return;
    }
    const enemy = request['gotRequestuid'];
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
    const user = querySnapshot.docs[0].ref.parent.parent?.id;
    return user;
  }
};

const alreadyFriend = async (displayName) => {
  //displayNameがフレンドかを判定する処理
  const user = auth.currentUser;
  if (!user) {
    return;
  }
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
  if  (!user){
    return;
  }
  if (await alreadyFriend(name)) {
    setMessage('すでにフレンドです。');
  } else {
  if (enemy !== null) {
    const sentRequestsRef = collection(firestore, `users/${user.uid}/sentRequests`);
    const sentRequestsQuery = query(sentRequestsRef, where('sendRequest', '==', name));
    const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
    if (sentRequestsSnapshot.size > 0) {
      setMessage(`すでに ${name} \nにフレンド申請を送っています。`);
    } else {
      try {
        const docRef = await addDoc(collection(firestore, `users/${user.uid}/sentRequests`), {
          sendRequest: name
        });
        const doRef = await addDoc(collection(firestore, `users/${enemy}/gotRequests`), {
          gotRequest: user.displayName,
          gotRequestuid: user.uid,
          getRequesticon: user.photoURL
        });
        setMessage(`${name} \nにフレンド申請を送りました!`);
      } catch (e) {
        setMessage('フレンド申請に失敗しました。');
      }
    }
    } else {
      setMessage('ユーザーが見つかりませんでした。');
    }
  };
  };

  // request,request['gotRequest'],request['photoURL']でfriendを作ってください
  const friend = (request) => {
    const friendd = { request, friend: request['gotRequest'], photoURL: request['photoURL'], status:request['status'], message:request['message'] };
    return friendd;
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => handleTabPress('friends')}
        >
          <Text style={styles.tabText}>フレンド一覧</Text>
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
          <Text style={styles.tabText}>リクエスト</Text>
        </TouchableOpacity>
      </View>
      {/* フレンド欄 */}
      {activeTab === 'friends' && (
      <>
        <FriendList friends={friends} />
      </>
      )}
      {/* フレンドリクエスト欄 */}
      {activeTab === 'requests' && (
      <>
        <FriendModal selectedFriend={selectedFriend} onClose={() => setSelectedFriend(null)} />
        {friendRequests.map((request) => (
          <TouchableOpacity key={request.id} style={styles.request} onPress={() => setSelectedFriend(friend(request))}>
            {request['photoURL'] ? (
                <Image source={{ uri: request['photoURL'] }} style={{ left: '9%', width: 55, height: 55, borderRadius: 40 }} />
              ) : (
                <Ionicons name="person-circle-outline" style={{ left: '3%' }} size={65} color={'gray'} />
              )}
            <Text style={{ marginLeft: '4%',fontWeight: 'bold', fontSize: 20 }}>{request['gotRequest'].length > 13 ? request['gotRequest'].slice(0,11)+ '...' : request['gotRequest']}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => handleAccept(request)}>
                <Ionicons name="checkmark-circle-outline" size={40} color={'green'} style={{ marginRight: '1%' }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReject(request)} style={{ marginRight: '12%' }}>
                <Ionicons name="close-circle-outline" size={40} color={'red'} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        {friendRequests.length === 0 && (
          <Text style={{ color: 'gray', marginTop:'80%'}}>リクエストはありません</Text>
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
            <View>
              <QRCode value={user.uid} size={200} />
            </View>
            <Text style={styles.modalText}>フレンドリクエスト送信</Text>
            <TouchableOpacity onPress={() => setQrModalVisible(true)}><Text>QRcodeでフレンド交換</Text></TouchableOpacity>
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


        <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setQrModalVisible(false);
        }}
      >


      </Modal>

      </Modal>
      <View>
      </View>

    </View>
    
  );
};


export default FriendScreen;