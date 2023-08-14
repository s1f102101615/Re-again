import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ApoScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<{ id: string; title: string; content: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<{ name: string }[]>([]);
  const [friends, setFriends] = useState<{ name: string }[]>([]);
  const [friendModalVisible, setFriendModalVisible] = useState(false);

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
      const friends: { name: string }[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          return friends.push({ name: doc.get('friend') } as { name: string });
        });
      }
      setFriends(friends); // 新しい配列を作成して、それをfriendsに設定する
    });
    return () => {
      listfriend();
    };
  }, []);

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
        inviter: 'test',
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
      const appointments: { id: string; title: string; content: string }[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          return appointments.push({ id: doc.id, ...doc.data() } as { id: string; title: string; content: string });
        });
      }
      setAppointments(appointments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
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
                <TouchableOpacity onPress={() => setSelectedFriends([...selectedFriends, friend])}>
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
                      <Text key={friend.name}>{friend.name}</Text>
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
      {/* 約束表示 */}
      {appointments.map((appointment) => (
        <View key={appointment.id}>
          <Text>{appointment.title}</Text>
          <Text>{appointment.content}</Text>
        </View>
      ))}
      {/* 約束追加アイコン */}
      <View style={styles.circleContainer}>
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
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
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
    bottom: 20,
    right: 20,
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
});

export default ApoScreen;