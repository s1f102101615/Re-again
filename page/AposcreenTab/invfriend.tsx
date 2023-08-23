import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { auth, firebase, firestore } from '../../firebase';
import { collection, query, where, QuerySnapshot, getDocs, onSnapshot } from 'firebase/firestore';


const InvFriend = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPromise, setSelectedPromise] = useState(null);
  const [promises, setPromises] = useState([]);

    //promisesはnewAppoのドキュメントのinviterの配列の中の辞書型のnameがnameであれば取得す
  useEffect(() => {
    const user = auth.currentUser;
    const q = query(collection(firestore, `newAppo`), where('inviter', 'array-contains', {name: user.displayName}));
    const listpromise = onSnapshot(q, (querySnapshot) => {
      const promises = [];
      querySnapshot.forEach((doc) => {
        promises.push({ ...doc.data(), id: doc.id });
      });
      console.log(promises)
      setPromises(promises); // 新しい配列を作成して、それをpromisesに設定する
    });
    return () => listpromise();
  }
  , []);


  const handleAccept = () => {
    // 承諾の処理
  };

  const handleReject = () => {
    // 拒否の処理
  };

  return (
    <View style={styles.container}>
      {promises.map((promise) => (
        <TouchableOpacity key={promise.id} onPress={() => {
          setSelectedPromise(promise);
          setModalVisible(true);
        }} style={styles.promise}>
          <Text style={styles.promiseTitle}>{promise.title}</Text>
        </TouchableOpacity>
      ))}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{selectedPromise?.title}</Text>
          <Text style={styles.modalDescription}>{selectedPromise?.description}</Text>
          <TouchableOpacity onPress={handleAccept} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>承諾</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReject} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>拒否</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setSelectedPromise(null);
            setModalVisible(false);
          }} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  promise: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  promiseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvFriend;