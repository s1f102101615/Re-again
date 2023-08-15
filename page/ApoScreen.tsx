import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, DateData } from 'react-native-calendars';

const ApoScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<{ id: string; title: string; content: string; appointmentDate: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<{ name: string , id:string}[]>([]);
  const [friends, setFriends] = useState<{ name: string , id:string}[]>([]);
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  

  useEffect(() => {
    // フレンドを取得する処理
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
    const f = query(collection(firestore, `users/${user.uid}/friends`));
    const listfriend = onSnapshot(f, (querySnapshot) => {
      //frinedsの中身にuserのfriendを入れる
      const friends: { name: string, id:string }[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          return friends.push({ name: doc.get('friend') } as { name: string, id:string });
        });
      }
      setFriends(friends); // 新しい配列を作成して、それをfriendsに設定する
    });
    return () => {
      listfriend();
    };
  }, []);

  // カレンダーの日付を選択したときの処理
  const handleDayPress = (day) => {
    // 記事を取得する処理
    // setSelectedDate(day.dateString);
    toggleCalendar();
  };

  // カレンダーの月を変更したときの処理
  const handleMonthChange = (month: DateData) => {
    setSelectedMonth(new Date(month.timestamp));
  };

  // 選択した月の予定を取得
  const filteredAppointments = appointments.filter(({ appointmentDate }) => {
    const date = new Date(
      Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000
    );
    console.log(date.getMonth(),selectedMonth.getMonth())
    return date.getMonth() === selectedMonth.getMonth() && date.getFullYear() === selectedMonth.getFullYear();
  });
  

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleDateChange = (date: Date) => {
    setShowDatePicker(false);
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      selectedDate.getHours(),
      selectedDate.getMinutes()
    );
    setSelectedDate(newDate);
  };

  const handleTimeChange = (time: Date) => {
    setShowTimePicker(false);
    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    setSelectedDate(newDate);
  };


  const handlePressDate = () => {
    setShowDatePicker(true);
  };

  const handlePressTime = () => {
    setShowTimePicker(true);
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedFriends([]);
    setSelectedDate(new Date());
    setModalVisible(false);
  };

  const markedDates = {};

  // データを解析してカレンダーにマークを付けるデータを作成
  appointments.forEach(appointment => {
    const appointmentTimestamp = new Date(
      Number(appointment.appointmentDate['seconds']) * 1000 + Number(appointment.appointmentDate['nanoseconds']) / 1000000
    );
    const year = appointmentTimestamp.getUTCFullYear();
    const month = appointmentTimestamp.getUTCMonth() + 1; // 0から始まるため +1
    const day = appointmentTimestamp.getUTCDate();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

    // マークデータを設定
    markedDates[formattedDate] = { marked: true, dotColor: 'blue' };
  });
  const handleSave = async () => {
    //約束を保存する処理
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
    try {
      const docRef = await addDoc(collection(firestore, 'newAppo'), {
        hostname: user.uid,
        inviter: selectedFriends,
        title: title,
        content: content,
        appointmentDate: selectedDate,
        createdAt: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      setTitle(''); // タイトルをクリアする
      setContent(''); // コンテンツをクリアする
      setSelectedDate(new Date()); // 日付を初期化する
      setModalVisible(false); // モーダルを閉じる
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setModalVisible(false);
  };

  useEffect(() => {
    //約束を取得する処理
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
    const q = query(collection(firestore, 'newAppo'), where('hostname', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointments: { id: string; title: string; content: string; appointmentDate:string}[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          return appointments.push({ id: doc.id, ...doc.data() } as { id: string; title: string; content: string; appointmentDate: string });
        });
      }
      console.log(appointments);
      setAppointments(appointments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* カレンダー */}
      {calendarVisible && (
        <View>
          <Calendar
            onDayPress={handleDayPress} 
            markedDates={markedDates}
            onMonthChange={handleMonthChange}
          />
        </View>
      )}
      <Text>{selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
      <TouchableOpacity style={styles.calendarline} onPress={toggleCalendar} />

        {/* 約束追加 */}
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <Modal
            transparent={true}
            visible={friendModalVisible}
            onRequestClose={() => {
              setFriendModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text>招待する友達を選択してください</Text>
                {friends.map((friend) => (
                  <TouchableOpacity key={friend.id} onPress={() => setSelectedFriends([...selectedFriends, friend])}>
                    <Text>{friend.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.closeButton} onPress={() => {
                  setFriendModalVisible(false);
                }}>
                  <Text style={styles.closeButtonText}>閉じる</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={handleDateChange}
              onCancel={() => setShowDatePicker(false)}
              locale="ja"
            />
            <DateTimePickerModal
              isVisible={showTimePicker}
              mode="time"
              onConfirm={handleTimeChange}
              onCancel={() => setShowTimePicker(false)}
              locale="ja"
            />
              <View>
                <Text>Apo Screen</Text>
                <TextInput
                  style={styles.input1}
                  onChangeText={setTitle}
                  value={title}
                  placeholder="約束名を入力してください"
                />
                <TextInput
                  style={styles.input1}
                  onChangeText={setContent}
                  value={content}
                  placeholder="詳細を入力してください"
                />
              <View>
                <View>
                  <Text onPress={handlePressDate}>日付: {selectedDate.toLocaleDateString("ja-JP")}</Text>
                </View>
                <View>
                  <Text onPress={handlePressTime}>時間:{selectedDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => setFriendModalVisible(true)}>
                    <Text>招待する友達を選択</Text>
                  </TouchableOpacity>
                  {selectedFriends.length > 0 && (
                    <View>
                      <Text>選択されたフレンド:</Text>
                      {selectedFriends.map((friend) => (
                        <Text key={friend.id}>{friend.name}</Text>
                      ))}
                    </View>
                  )}
                </View>
                <Button title="Save" onPress={handleSave} />
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>閉じる</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={styles.scrollContainer} style={{height: calendarVisible ? '54%' : '97%'}}>
        {/* 約束表示 */}
        {/* {appointments.map((appointment) => (
          <View style={styles.contain}>
          <Text style={styles.title}>{appointment.title}</Text>
          <Text style={styles.content}>{appointment.content}</Text>
        </View>
        ))} */}
        {filteredAppointments.map(({ id, title, appointmentDate }) => (
          <View key={id}>
            <Text>{title}</Text>
            <Text>{new Date(appointmentDate).toLocaleString()}</Text>
          </View>
        ))}
        </ScrollView>
      <View style={styles.circleContainer} >
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.circle}>
          <Ionicons name="add" size={32} color="#fff" />
        </View>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 'auto',
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
    bottom: '7%',
    right: 20,
    zIndex: 2,
  },
  circleContainerd: {
    position: 'absolute',
    bottom: '34%',
    right: 20,
    zIndex: 2,
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
  input1: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    width: 230,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
    ,
  },
  content: {
    fontSize: 16,
  },
  contain: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 100,
    width: '90%',
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    
  },
  calendarline: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 27,
    backgroundColor: '#000000',
    
  },

});

export default ApoScreen;