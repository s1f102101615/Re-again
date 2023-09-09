import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styles from './css/TalkList';
import { ta } from 'date-fns/locale';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import axios from 'axios';


// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });


const TalkList = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<{ id: string; title: string; content: string; appointmentDate: string; talkroomid:string; newtalk:string }[]>([]);
  // const [expoPushToken,setExpoPushToken] = useState(null);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  // const [pushState,setPushState] = useState(null);

  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Constants.isDevice) {
  //     ////①このアプリからのPush通知の許可を取得
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       //②初回起動時は許可ダイアログを出してユーザからPush通知の許可を取得
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       //許可がない場合
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     //③通知用トークンの取得
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log(token);
  //   } else {
  //     //実機以外の場合
  //     alert('Must use physical device for Push Notifications');
  //   }
  //   return token;
  // }

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
      const unsubscribe2 = onSnapshot(q2, async (querySnapshot) => {
        const appointments: { id: string; title: string; content: string; appointmentDate:string; talkroomid:string; newtalk:string}[] = [];
        if (!querySnapshot.empty) {
          for (const doc of querySnapshot.docs) {
            const data = doc.data();
            if ((data.hostname === user?.uid || (data.appointer && data.appointer.some((inviterObj) => inviterObj.name === user?.displayName))) && (new Date(Number(data.appointmentDateEnd['seconds']) * 1000 + Number(data.appointmentDateEnd['nanoseconds']) / 1000000).getTime() > new Date().getTime())) {
              appointments.push({ id: doc.id, ...data, newtalk:data.newtalk } as { id: string; title: string; content: string; appointmentDate: string; talkroomid: string; newtalk: string });
            }
          }
        }
        setAppointments(appointments);
      });
      return () => {
        // unsubscribe();
        unsubscribe2();
      };
    },[]);

    // const sendPushNotification = async () => {
    //   const message = {
    //     to: '4IYnGPADOIzF3tR0iepioi',
    //     title: 'テスト',
    //     body: 'できた！',
    //   };
    
    //   try {
    //     const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
    //       headers: {
    //         host: 'exp.host',
    //         accept: 'application/json',
    //         'accept-encoding': 'gzip, deflate',
    //         'content-type': 'application/json',
    //       },
    //     });
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // const scheduleNotificationAsync = async () => {
    //   await Notifications.scheduleNotificationAsync({
    //     content: {
    //       body: 'test'
    //     },
    //     trigger: {
    //       seconds: 3,
    //     }
    //   })
    // }

  
  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <TouchableOpacity style={styles.contain} key={appointment.id} onPress={() => handleTalkPress(appointment.talkroomid)}>
            <Text style={styles.title}>{appointment.title.length > 13 ? appointment.title.slice(0,13)+ '...' : appointment.title}</Text>
            <Text style={styles.newtalk}>{appointment.newtalk}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noAppointmentContainer}>
          <Text style={styles.noAppointmentText}>トークルームはありません</Text>
        </View>
      )}
      {/* <Button
        title="push通知用のトークンを取得"
        onPress={async () => {
          const pushToken = await registerForPushNotificationsAsync()
          setExpoPushToken(pushToken);
        }}
      />
      <Button
        title="push通知"
        onPress={sendPushNotification}
      />
       <Button
        title='3秒後にプッシュ通知する'
        onPress={scheduleNotificationAsync}
      /> */}
    </ScrollView>
  );
};

export default TalkList;