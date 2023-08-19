import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, DateData } from 'react-native-calendars';
import { format, addMonths, subMonths, lightFormat } from 'date-fns';
import RNCalendarEvents from "react-native-calendar-events";

const ApoScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<{ id: string; title: string; content: string; appointmentDate: string; inviter:[]; talkroomid:string;createAt:DateData}[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<{ name: string , id:string}[]>([]);
  const [friends, setFriends] = useState<{ name: string , id:string }[]>([]);
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  const [showApoModalVisible, setShowApoModalVisible] = useState(false);
  const [showTitle, setShowTitle] = useState('');
  const [showContent, setShowContent] = useState('');
  const [showApoDate, setShowApoDate] = useState('');
  const [showInviter, setShowInviter] = useState([]);
  const [showTalkroomid, setShowTalkroomid] = useState('');
  const [showCreateAt, setShowCreateAt] = useState('');
  const [searchText, setSearchText] = useState('');
  const [serchAppointments, setSerchAppointments] = useState<{ id: string; title: string; content: string; appointmentDate: string; inviter:[]; talkroomid:string;createAt:DateData}[]>([]);

  //カレンダーの日を選択したときの処理(ここで調整する*今はdays-1 * 115)
  const handleDayPress = (day: DateData) => {
    const date = new Date(day.timestamp);
    const days = date.getDate()-1;
    const yOffset = +115; // スクロール位置を微調整する場合は、ここを調整してください
    console.log(days * yOffset);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: (days * yOffset), animated: true });
    }
  };
  

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
          return friends.push({ name: doc.get('friend'), id: doc.id } as { name: string, id:string });
        });
      }
      setFriends(friends); // 新しい配列を作成して、それをfriendsに設定する
    });
    return () => {
      listfriend();
    };
  }, []);


  // カレンダーの月を変更したときの処理
  const handleMonthChange = (month: DateData) => {
    setSelectedMonth(new Date(month.timestamp));
  };

  // 検索ボックスのテキストが変更されたときappointmetsをフィルタリングする 
  useEffect(() => {
    const serch = appointments.filter(({ title, content }) => {
      return title.includes(searchText) || content.includes(searchText);
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


  // 選択した月の予定を取得(昇順に並び替え)
  // 
  const filteredAppointments = appointments.filter(({ appointmentDate }) => {
    const date = new Date(
      Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000
    );
    return date.getMonth() === selectedMonth.getMonth() && date.getFullYear() === selectedMonth.getFullYear();
  }).sort((a, b) => {
    const dateA = Number(a.appointmentDate['seconds']) * 1000 + Number(a.appointmentDate['nanoseconds']) / 1000000;
    const dateB = Number(b.appointmentDate['seconds']) * 1000 + Number(b.appointmentDate['nanoseconds']) / 1000000;
    return dateA - dateB;
  });

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
    setSelectedMonth(new Date());
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

  //記事をスクロールで下げれる 離したときに下がりきるようにしたい
  const handleScrollEnd = (event) => {
    console.log(event.nativeEvent.contentOffset.y)
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < -120) {
      setShowApoModalVisible(false);;
    }
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
      const randamid = Math.random().toString(32).substring(2);
      const docRef = await addDoc(collection(firestore, 'newAppo'), {
        hostname: user.uid,
        inviter: selectedFriends,
        title: title,
        content: content,
        talkroomid: randamid,
        appointmentDate: selectedDate,
        createdAt: new Date(),
      });
      // firestoreにtalkroomを作成
      const talkroomRef = collection(firestore, `talkroom/${randamid}/title`)
      const talkroomdocRef = await addDoc(talkroomRef, {
        talktitle:title,
      });
      console.log("Document written with ID: ", talkroomdocRef.id);
      setTitle(''); // タイトルをクリアする
      setContent(''); // コンテンツをクリアする
      setSelectedDate(new Date()); // 日付を初期化する
      setModalVisible(false); // モーダルを閉じる
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setModalVisible(false);
  };

  // 約束を選択したときの処理
  const setSelectedApo = (id: string, title: string, appointmentDate: string, content: string, inviter: [], talkroomid:string, createAt:DateData) => {
    const date = new Date(
      Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000
    );
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 0から始まるため +1
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    //CreatAtのDateDataを解析してstringにする
    const createAtDate = new Date(
      Number(createAt['seconds']) * 1000 + Number(createAt['nanoseconds']) / 1000000
    );
    const createAtyear = createAtDate.getUTCFullYear();
    const createAtmonth = createAtDate.getUTCMonth() + 1; // 0から始まるため +1
    const createAtday = createAtDate.getUTCDate();
    const createAtdays = createAtDate.getUTCDay();
    const createAthours = createAtDate.getUTCHours();
    const createAtminutes = createAtDate.getUTCMinutes();
    const createAtseconds = createAtDate.getUTCSeconds();
    const formattedCreateAtDate = `${createAtyear}-${createAtmonth < 10 ? '0' : ''}${createAtmonth}-${createAtday < 10 ? '0' : ''}${createAtday} ${createAthours < 10 ? '0' : ''}${createAthours}:${createAtminutes < 10 ? '0' : ''}${createAtminutes}:${createAtseconds < 10 ? '0' : ''}${createAtseconds}`;

    //これらのデータをuseStateに入れる
    setShowApoDate(formattedDate);
    setShowTitle(title);
    setShowContent(content);
    setShowInviter(inviter);
    setShowTalkroomid(talkroomid);
    setShowCreateAt(formattedCreateAtDate);
    setShowApoModalVisible(true);
    }

  useEffect(() => {
  //約束を取得する処理
  const user = auth.currentUser;
  if (!user) {
    console.error('User is not logged in.');
    return;
  }
    const q2 = query(collection(firestore, 'newAppo'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      const appointments: { id: string; title: string; content: string; appointmentDate: string; inviter:[]; talkroomid:string;createAt:DateData}[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
            if (data.hostname === user.uid || (data.inviter && data.inviter.some((inviterObj) => inviterObj.name === user.displayName))) {
              appointments.push({
                id: doc.id,
                title: data.title,
                content: data.content,
                appointmentDate: data.appointmentDate,
                inviter: data.inviter,
                talkroomid: data.talkroomid,
                createAt: data.createdAt,
              });
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
    <View style={styles.container}>
      {/* カレンダー */}
      {calendarVisible ? (
        <View>
          <Calendar
            onDayPress={handleDayPress} 
            markedDates={markedDates}
            onMonthChange={handleMonthChange}
            monthFormat={'yyyy年 MM月'}
          />
        </View>
      ):(
        <View style={{ height:'6.5%' }}>
          <Calendar
            onDayPress={handleDayPress} 
            markedDates={markedDates}
            onMonthChange={handleMonthChange}
            monthFormat={'yyyy年 MM月'}
          />
        </View>
      )}
      <TouchableOpacity activeOpacity={1} style={styles.calendarline} onPress={toggleCalendar} />
        {/* 約束詳細 */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={showApoModalVisible}
          onRequestClose={() => {
            setShowApoModalVisible(false);
          }}
          
        >
          <ScrollView style={styles.centeredView} scrollEventThrottle={100} contentContainerStyle={styles.contentContainer} onScrollEndDrag={handleScrollEnd}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>約束の詳細</Text>
                <TouchableOpacity style={styles.closeButtonX} onPress={() => {
                  setShowApoModalVisible(false);
                }}>
                  <Ionicons name="close" size={30} color="black" />
                </TouchableOpacity>
              </View>
                <View style={styles.likeedit} >
                  <TouchableOpacity style={styles.item}>
                    <Ionicons name="close" size={30} color="black" />
                    <Text style={styles.label}>お気に入り</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.item}>
                  <Ionicons name="close" size={30} color="black" />
                    <Text style={styles.label}>約束している人</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.item}>
                    <Ionicons name="close" size={30} color="black" />
                    <Text style={styles.label}>招待</Text>
                  </TouchableOpacity>
                </View>
              <View style={ styles.lightLine } />
                <Text>約束名:{showTitle}</Text>
                <Text>詳細:{showContent}</Text>
                <Text>日付:{showApoDate}</Text>
                <Text>招待者:{showInviter.map((inviter) => (
                  <Text key={inviter.id}>{inviter.name}</Text>
                ))}</Text>
                <Text>トークルームID:{showTalkroomid}</Text>
                <Text>作成日:{showCreateAt ? showCreateAt.toLocaleString() : '日付不明'}</Text>
            </View>
          </ScrollView>
        </Modal>
      
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
            <View style={styles.centeredViewNewApo}>
              <View style={styles.modalViewNewApo}>
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
          <View style={styles.centeredViewNewApo}>
            <View style={styles.modalViewNewApo}>
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
        <ScrollView contentContainerStyle={styles.scrollContainer} style={{height: calendarVisible ? '54%' : '92%'}} ref={scrollViewRef}>
        {/* 約束表示 */}
        {/* {appointments.map((appointment) => (
          <View style={styles.contain}>
          <Text style={styles.title}>{appointment.title}</Text>
          <Text style={styles.content}>{appointment.content}</Text>
        </View>
        ))} */}
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        {/* // filteredAppointmentsからすべてまとめたfilteredAppointment */}
        {!searchText && filteredAppointments.map(({ id, title, appointmentDate, content , inviter, talkroomid, createAt}) => (
          <TouchableOpacity style={styles.contain} key={id} onPress={() => setSelectedApo(id, title, appointmentDate, content , inviter, talkroomid, createAt)} >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{(new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString())}</Text>
          </TouchableOpacity>
        ))}
        {searchText && serchAppointments.map(({ id, title, appointmentDate, content , inviter, talkroomid, createAt}) => (
          <TouchableOpacity style={styles.contain} key={id} onPress={() => setSelectedApo(id, title, appointmentDate, content , inviter, talkroomid, createAt)} >
            <Text style={styles.title}>{highlightText(title, searchText)}</Text>
            <Text style={styles.content}>{(new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString())}</Text>
          </TouchableOpacity>
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
    borderRadius: 5,
    padding: 10,
    marginTop: 0,
  },
  closeButtonX:{
    paddingTop:10,
    paddingRight:20,
  },
  closeButtonText: {
    color: 'Black',
    fontWeight: 'bold',
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
  },
  centeredViewNewApo: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    marginTop: '100%',
    borderRadius: 5,
    width: '100%',
    height: '150%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'flex-start',
  },
  modalViewNewApo: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '90%',
    height: '60%',
    padding: 45,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
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
    marginBottom: 5,
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
    justifyContent: 'flex-start',
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
  modalText: {
    marginBottom: 10,
  },
  searchBox: {
    width: '100%',
    height: 40,
    padding: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  highlight: {
    backgroundColor: 'yellow',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: '26%',
    marginTop: '2%',
  },
  likeedit: {
    flexDirection: 'row', // 要素を横に並べる
    justifyContent: 'space-between', // 要素間のスペースを均等に分配
    paddingHorizontal: '13%', // 左右のパディング
    alignItems: 'center', // 縦方向に中央揃え
    marginTop: '3%',
    marginRight: '4%',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 8,
  },
  lightLine: {
    height: 1,
    backgroundColor: '#000000',
    opacity: 0.2,
    marginTop: '7%',
  },
});

export default ApoScreen;