import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { auth, firebase, firestore } from '../../firebase';
import { collection, query, where, onSnapshot, doc, FieldValue, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import styles from '../css/invfriend';

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
      // 時間がマイナスになるものは除く
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (new Date(Number(data.appointmentDate['seconds']) * 1000 + Number(data.appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime() > 0) {
          promises.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            appointmentDate: data.appointmentDate,
            appointmentDateEnd: data.appointmentDateEnd,
            location: data.location,
            inviter: data.inviter,
            appointer: data.appointer,
          });
        }
      });
      setPromises(promises); // 新しい配列を作成して、それをpromisesに設定する
    });
    return () => listpromise();
  }
  , []);


  const handleAccept = async () => {
    // 承諾の処理 AcceptしたらそのnewAppoのinviterから削除して、newAppoの中のappointerに追加する
    const user = auth.currentUser;
    const newAppoRef = doc(firestore, 'newAppo', selectedPromise.id);
    // selectedPromise.idのドキュメントのinviterの配列の中の辞書型のnameがuser.displayNameであれば削除する
    const newinviter = selectedPromise.inviter.filter((inviter) => inviter.name !== user.displayName);
    // selectedPromise.appointerにuser.displayNameを追加する
    const newappointer = selectedPromise.appointer;
    newappointer.push({name: user.displayName});  
    await updateDoc(newAppoRef, {
      // selectedPromise.idのドキュメントのinviterの配列の中の辞書型のnameがuser.displayNameであれば削除する
      inviter: newinviter,
      appointer: newappointer,
    });
    setSelectedPromise(null);
    setModalVisible(false);
  };

  const handleReject = async () => {
    // 拒否の処理 RejectしたらそのnewAppoのinviterから削除する
    const user = auth.currentUser;
    const newAppoRef = doc(firestore, 'newAppo', selectedPromise.id);
    // selectedPromise.idのドキュメントのinviterの配列の中の辞書型のnameがuser.displayNameであれば削除する
    const newinviter = selectedPromise.inviter.filter((inviter) => inviter.name !== user.displayName);
    await updateDoc(newAppoRef, {
      // selectedPromise.idのドキュメントのinviterの配列の中の辞書型のnameがuser.displayNameであれば削除する
      inviter: newinviter,
    });
    setSelectedPromise(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {promises.map((promise) => (
        <TouchableOpacity style={styles.contain} key={promise.id} onPress={() => {setSelectedPromise(promise);setModalVisible(true);}} >
        <View style={{ flexDirection: 'row', height:'100%' }}>
          <View>
            <Text style={styles.contenttime}>{
            Math.floor((new Date(Number(promise.appointmentDate['seconds']) * 1000 + Number(promise.appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60))
            }時間{
              Math.floor(((new Date(Number(promise.appointmentDate['seconds']) * 1000 + Number(promise.appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60)) % 60)
            }分</Text>
          </View>
          <View style={styles.ibar}></View>
          <View>
            <Text style={styles.title}>{promise.title.length > 14 ? promise.title.slice(0,14)+ '...' : promise.title}</Text>
            <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start' }}>
              <View style={{ marginLeft:3, width:160 }}>
              <Text style={styles.content}>開始:{new Date(Number(promise.appointmentDate['seconds']) * 1000 + Number(promise.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</Text>
              {promise.appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(promise.appointmentDateEnd['seconds']) * 1000 + Number(promise.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
              </View>
              <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%', marginLeft:40 }}>
                <Ionicons name="md-pin" size={18} color="#900" />
                <Text>{promise.location ? promise.location.slice(0,3)+ '...' : '未設定   '}</Text>
              </View>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      ))}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{selectedPromise?.title}</Text>
          <Text style={styles.modalDescription}>{selectedPromise?.content}</Text>
          <Text style={styles.content}>開始:{new Date(Number(selectedPromise?.appointmentDate['seconds']) * 1000 + Number(selectedPromise?.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</Text>
          {selectedPromise?.appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(selectedPromise?.appointmentDateEnd['seconds']) * 1000 + Number(selectedPromise?.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
          <Text style={styles.modalDescription}>場所: {selectedPromise?.location}</Text>
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

export default InvFriend;