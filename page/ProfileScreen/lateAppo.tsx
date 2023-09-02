import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { auth, firestore } from '../../firebase';
import { User } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { DateData } from 'react-native-calendars';
import styles from './css/lateAppo';

const HomeScreen = () => {
  const [user, setUser] = useState<User>();
  const [displayName, setDisplayName] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);
  const [lateappo, setLateappo] = useState([]);
  const [selectedLateappo, setSelectedLateappo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [serchAppointments, setSerchAppointments] = useState([]);



  const navigator = useNavigation();
 


  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // const count = await getFriendsCount(user.uid);
        setFriendsCount(3);
      } else {
        setUser(undefined);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
    }
  // lateappoにはすでに終了している約束のドキュメントの配列を入れる
  // 過去の約束の取得
    const q2 = query(collection(firestore, 'newAppo'));
      const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
        const appointments: { id: string; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; location:string; talkroomid:string;createAt:DateData}[] = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if ((data.hostname === user.uid || (data.appointer && data.appointer.some((inviterObj) => inviterObj.name === user.displayName))) && !(new Date(Number(data.appointmentDateEnd['seconds']) * 1000 + Number(data.appointmentDateEnd['nanoseconds']) / 1000000).getTime() > new Date().getTime())) {
              appointments.push({ id: doc.id, ...data } as { id: string; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; location:string; talkroomid:string;createAt:DateData});
            }
          }
          );
        }
        // appointmentsを終了時間順にソート 降順にして
        appointments.sort(function(a,b){
          if(a.appointmentDateEnd > b.appointmentDateEnd) return -1;
          if(a.appointmentDateEnd < b.appointmentDateEnd) return 1;
          return 0;
        });
        setLateappo(appointments);
      }
      );
      return () => unsubscribe2();
  }
  , []);

  //マッチした文字に色を付ける
  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text>
        {parts.map((part, i) => (
          <Text key={i} style={part.toLowerCase() === highlight.toLowerCase() ? styles.highlight : null}>
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  useEffect(() => {
    const serch = lateappo.filter(({ title, content }) => {
      return title.includes(searchText);
    });
    const serchAppointmets = serch
    .filter(({ appointmentDate }) => {
      const date = new Date(
        Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000
      );
      return date;
    })
    .sort((a, b) => {
      const dateA = Number(a.appointmentDate['seconds']) * 1000 + Number(a.appointmentDate['nanoseconds']) / 1000000;
      const dateB = Number(b.appointmentDate['seconds']) * 1000 + Number(b.appointmentDate['nanoseconds']) / 1000000;
      return dateA - dateB;
    });

    setSerchAppointments(serchAppointmets);
  }
  , [searchText]);



  // lateappoは後で実装する
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchIconContainer}>
              <Ionicons name="search" size={20} color="black" />
          </TouchableOpacity>
          <View style={styles.searchBoxContainer}>
                <TextInput
                  style={styles.searchBox}
                  placeholder="Search"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                </View>
        </View>
        {!searchText && (lateappo.length > 0 ? (lateappo.map((lateappo) => (
          <TouchableOpacity style={styles.contain} key={lateappo.id} onPress={() => { setSelectedLateappo(lateappo); setModalVisible(true); } }>
            <View style={{ flexDirection: 'row', height: '100%' }}>
              {/* 〇月〇日のように表示してほしい */}
              <View>
                <Text style={styles.contenttime}>
                  <Text>{new Date(lateappo.appointmentDate.seconds * 1000).toLocaleString('ja-JP', { month: 'numeric' })}</Text>
                  <Text>{new Date(lateappo.appointmentDate.seconds * 1000).toLocaleString('ja-JP', { day: 'numeric' })}</Text>
                  <Text>終了</Text>
                </Text>
              </View>
              <View style={styles.ibar}></View>
              <View>
                <Text style={styles.title}>{lateappo.title.length > 14 ? lateappo.title.slice(0,14)+ '...' : lateappo.title}</Text>
                <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start' }}>
                  <View style={{ marginLeft:3, width:160 }}>
                    <Text style={styles.content}>開始:{new Date(Number(lateappo.appointmentDate['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
                    {lateappo.appointmentDateEnd && <Text style={styles.content}>終了:{new Date(Number(lateappo.appointmentDateEnd['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                  </View>
                  <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%', marginLeft:27 }}>
                    <Ionicons name="md-pin" size={18} color="#900" />
                    <Text>{lateappo.location ? lateappo.location.slice(0,3)+ '...' : '未設定   '}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))) : (
          <View style={styles.noAppointmentContainer}>
              <Text style={styles.noAppointmentText}>過去の約束はありません</Text>
            </View>
        ))}
        {searchText && (serchAppointments.length > 0 ? (serchAppointments.map((lateappo) => (
          <TouchableOpacity style={styles.contain} key={lateappo.id} onPress={() => { setSelectedLateappo(lateappo); setModalVisible(true); } }>
            <View style={{ flexDirection: 'row', height: '100%' }}>
              {/* 〇月〇日のように表示してほしい */}
              <View>
                <Text style={styles.contenttime}>
                  <Text>{new Date(lateappo.appointmentDate.seconds * 1000).toLocaleString('ja-JP', { month: 'numeric' })}</Text>
                  <Text>{new Date(lateappo.appointmentDate.seconds * 1000).toLocaleString('ja-JP', { day: 'numeric' })}</Text>
                  <Text>終了</Text>
                </Text>
              </View>
              <View style={styles.ibar}></View>
              <View>
              <Text style={styles.title}>{lateappo.title.length > 14 ? highlightText(lateappo.title.slice(0,14) + '...',searchText) : highlightText(lateappo.title, searchText)}</Text>
                <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start' }}>
                  <View style={{ marginLeft:3, width:160 }}>
                    <Text style={styles.content}>開始:{new Date(Number(lateappo.appointmentDate['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
                    {lateappo.appointmentDateEnd && <Text style={styles.content}>終了:{new Date(Number(lateappo.appointmentDateEnd['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                  </View>
                  <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%', marginLeft:27 }}>
                    <Ionicons name="md-pin" size={18} color="#900" />
                    <Text>{lateappo.location ? lateappo.location.slice(0,3)+ '...' : '未設定   '}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))) : (
          <View style={styles.noAppointmentContainer}>
              <Text style={styles.noAppointmentText}>過去の約束はありません</Text>
            </View>
        ))}
    </ScrollView>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        } }
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{selectedLateappo?.title}</Text>
          <Text style={styles.modalDescription}>{selectedLateappo?.content}</Text>
          <Text style={styles.modalDescription}>開始:{new Date(Number(selectedLateappo?.appointmentDate['seconds']) * 1000 + Number(selectedLateappo?.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
          {selectedLateappo?.appointmentDateEnd && <Text style={styles.modalDescription}>終了:{new Date(Number(selectedLateappo?.appointmentDateEnd['seconds']) * 1000 + Number(selectedLateappo?.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setModalVisible(false);
            } }
          >
            <Text style={styles.modalButtonText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </Modal></>

  );
};

export default HomeScreen;
