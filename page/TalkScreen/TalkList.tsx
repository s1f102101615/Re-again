import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styles from './css/TalkList';


const TalkList = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<{ id: string; title: string; content: string; appointmentDate: string; talkroomid:string }[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);

  //navigatgeで遷移するときにtalkroomidを渡す
  const handleTalkPress = (talkroomId: string) => {
    navigation.navigate('Talk', { talkroomId });
  };
  useEffect(() => {
    //約束を取得する処理
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
      const q2 = query(collection(firestore, 'newAppo'));
      const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
        const appointments: { id: string; title: string; content: string; appointmentDate:string; talkroomid:string}[] = [];
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
              if (data.hostname === user.uid || (data.inviter && data.inviter.some((inviterObj) => inviterObj.name === user.displayName))) {
                appointments.push({ id: doc.id, ...data } as { id: string; title: string; content: string; appointmentDate: string; talkroomid:string});
              }
          });
        }
        setAppointments(appointments);
      });
      return () => {
        // unsubscribe();
        unsubscribe2();
      };
    },[]);
  
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      {appointments.map((appointment) => (
        <TouchableOpacity style={styles.contain}key={appointment.id} onPress={() => handleTalkPress(appointment.talkroomid)}>
          <Text style={styles.title}>{appointment.title}</Text>
          <Text style={styles.content}>{appointment.content}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.circleContainer} >
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.circle}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TalkList;