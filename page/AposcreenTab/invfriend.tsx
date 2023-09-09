import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { auth, firebase, firestore } from '../../firebase';
import { collection, query, where, onSnapshot, doc, FieldValue, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import styles from '../css/invfriend';
import * as ExpoCalendar from 'expo-calendar';
import { Picker } from '@react-native-picker/picker';
import { set } from 'date-fns';


const InvFriend = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPromise, setSelectedPromise] = useState(null);
  const [promises, setPromises] = useState([]);
  const [alarmtime, setAlarmtime] = useState(-1);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);

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

    console.log(selectedPromise);

    await updateDoc(newAppoRef, {
      // selectedPromise.idのドキュメントのinviterの配列の中の辞書型のnameがuser.displayNameであれば削除する
      inviter: newinviter,
      appointer: newappointer,
    });

    // selectedPromise.appointmentDateをDate型に変換
    const date = new Date(Number(selectedPromise.appointmentDate['seconds']) * 1000 + Number(selectedPromise.appointmentDate['nanoseconds']) / 1000000);
    // selectedPromise.appointmentDateEndをDate型に変換
    const dateEnd = new Date(Number(selectedPromise.appointmentDateEnd['seconds']) * 1000 + Number(selectedPromise.appointmentDateEnd['nanoseconds']) / 1000000);
    // 手元のカレンダーに追加
    const eventDetails = {
      title: selectedPromise.title, // 予定のタイトル
      startDate: date, // 開始日時
      endDate: dateEnd, // 終了日時
      timeZone: 'Asia/Tokyo', // タイムゾーン
      location: selectedPromise.location[0], // 場所
      notes: selectedPromise.content, // メモ
      // -1だったら通知しない
      alarms: alarmtime === -1 ? [] : [{ relativeOffset: alarmtime }], // 通知
    };
    try {
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendar = await ExpoCalendar.getDefaultCalendarAsync();
        const eventId = await ExpoCalendar.createEventAsync(calendar.id, eventDetails);
        console.log('Event added with ID:', eventId);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }

    setAlarmtime(-1);
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
              <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%', marginLeft:27 }}>
                <Ionicons name="md-pin" size={18} color="#900" />
                <Text>{promise.location[0] ? promise.location[0].slice(0,3)+ '...' : '未設定   '}</Text>
              </View>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      ))}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{selectedPromise?.title}</Text>
          <Text style={styles.modalDescription}>{selectedPromise?.content || '未設定'}</Text>
          <Text style={styles.content}>開始:{new Date(Number(selectedPromise?.appointmentDate['seconds']) * 1000 + Number(selectedPromise?.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</Text>
          {selectedPromise?.appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(selectedPromise?.appointmentDateEnd['seconds']) * 1000 + Number(selectedPromise?.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
          <Text style={styles.modalDescription}>場所: {selectedPromise?.location[0] || '未設定'}</Text>
          <TouchableOpacity onPress={() => {setAlarmModalVisible(true);}}>
                    <Text style={styles.item}>アラーム設定</Text>
            </TouchableOpacity>
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

        <Modal
            transparent={true}
            visible={alarmModalVisible}
            onRequestClose={() => {
              setAlarmModalVisible(false);
            }}
          >
            <View style={styles.centeredViewNewApo}>
              <View style={styles.modalViewalarm}>
                <Text style={styles.modalTitleAlarm}>アラームの設定</Text>
                <Picker
                  selectedValue={alarmtime}
                  onValueChange={(itemValue) => setAlarmtime(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="無し" value={-1} />
                  <Picker.Item label="イベント直前" value={0} />
                  <Picker.Item label="5分前" value={-5} />
                  <Picker.Item label="10分前" value={-10} />
                  <Picker.Item label="15分前" value={-15} />
                  <Picker.Item label="30分前" value={-30} />
                  <Picker.Item label="1時間前" value={-60} />
                  <Picker.Item label="2時間前" value={-120} />
                  <Picker.Item label="1日前" value={-1440} />
                  <Picker.Item label="2日前" value={-2880} />
                  <Picker.Item label="1週間前" value={-10080} />
                </Picker>
                <TouchableOpacity style={styles.closeButtonalarm} onPress={() => setAlarmModalVisible(false)}>
                  <Text style={styles.closeButtonTexts}>閉じる</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      </Modal>
    </View>
  );
};

export default InvFriend;