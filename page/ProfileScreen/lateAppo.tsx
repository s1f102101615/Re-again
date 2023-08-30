import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { auth, firestore } from '../../firebase';
import { User } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { DateData } from 'react-native-calendars';


const HomeScreen = () => {
  const [user, setUser] = useState<User>();
  const [displayName, setDisplayName] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);
  const [lateappo, setLateappo] = useState([]);
  const [selectedLateappo, setSelectedLateappo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


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
        const appointments: { id: string; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; talkroomid:string;createAt:DateData}[] = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if ((data.hostname === user.uid || (data.appointer && data.appointer.some((inviterObj) => inviterObj.name === user.displayName))) && !(new Date(Number(data.appointmentDateEnd['seconds']) * 1000 + Number(data.appointmentDateEnd['nanoseconds']) / 1000000).getTime() > new Date().getTime())) {
              appointments.push({ id: doc.id, ...data } as { id: string; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; talkroomid:string;createAt:DateData});
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





  // lateappoは後で実装する
  return (
    <><ScrollView style={styles.container}>
      {lateappo.map((lateappo) => (
        <TouchableOpacity style={styles.contain} key={lateappo.id} onPress={() => { setSelectedLateappo(lateappo); setModalVisible(true); } }>
          <View style={{ flexDirection: 'row', height: '100%' }}>
            {/* 〇月〇日のように表示してほしい */}
            <Text style={styles.contenttime}>
              <Text>{new Date(lateappo.appointmentDate.seconds * 1000).toLocaleString('ja-JP', { month: 'numeric' })}</Text>
              <Text>{new Date(lateappo.appointmentDate.seconds * 1000).toLocaleString('ja-JP', { day: 'numeric' })}</Text>
              <Text>終了</Text>
            </Text>
            <View style={styles.ibar}></View>
            <View>
              <Text style={styles.title}>{lateappo.title}</Text>
              <View style={{ marginTop: 11, marginLeft: 3 }}>
                <Text style={styles.content}>開始:{new Date(Number(lateappo.appointmentDate['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
                {lateappo.appointmentDateEnd && <Text style={styles.content}>終了:{new Date(Number(lateappo.appointmentDateEnd['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', width: '30%' }}>
              <Ionicons name="md-pin" size={18} color="#900" />
              <Text>場所</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    alignContent: 'center',
    justifyContent: 'center',
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
  contain: {
    backgroundColor: '#f7feff',
    height: 80,
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'flex-start',
  },
  contenttime: {
    fontSize: 16,
    height: '100%',
    width: '27%',
    textAlign: 'center',
    paddingTop: '7%',
  },
  ibar: {
    width: '2%',
    height: '100%',
    backgroundColor: '#f13434',
    opacity: 0.2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 3,
  },
  content: {
    fontSize: 16,
  },
});

export default HomeScreen;
