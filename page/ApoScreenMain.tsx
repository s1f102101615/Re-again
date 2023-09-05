import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, addDoc, onSnapshot, where, getDocs, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, DateData } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import * as ExpoCalendar from 'expo-calendar';
import styles from './css/AppoScreen';
import { list } from 'firebase/storage';
import MapScreen from './MapScreen';
import axios from 'axios';
import { Image } from 'react-native';
import { set } from 'date-fns';


const ApoScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [appointments, setAppointments] = useState<{ id: string; hostname:string; appointer:[]; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; location:string; talkroomid:string;createAt:DateData}[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [showTimePickerEnd, setShowTimePickerEnd] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<{ name: string, photoURL:string }[]>([]);
  const [friends, setFriends] = useState<{ name: string, photoURL:string }[]>([]);
  const [friendModalVisible, setFriendModalVisible] = useState(false);
  const [friendModalVisibled, setFriendModalVisibled] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollViewRefs = useRef<ScrollView>(null);
  const [showApoModalVisible, setShowApoModalVisible] = useState(false);
  const [showTitle, setShowTitle] = useState('');
  const [showContent, setShowContent] = useState('');
  const [showApoDate, setShowApoDate] = useState('');
  const [showInviter, setShowInviter] = useState([]);
  const [showTalkroomid, setShowTalkroomid] = useState('');
  const [showCreateAt, setShowCreateAt] = useState('');
  const [searchText, setSearchText] = useState('');
  const [star,setStar] = useState(false);
  const [serchAppointments, setSerchAppointments] = useState<{ id: string; hostname:string; appointer:[]; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; location:string; talkroomid:string;createAt:DateData}[]>([]);
  const [likeAppointments, setLikeAppointments] = useState<{ id: string; hostname:string; appointer:[]; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; location:string; talkroomid:string;createAt:DateData}[]>([]);
  const [selectnowFriends, setSelectnowFriends] = useState<{ name: string, photoURL:string}[]>([]);
  const [notSelectedFriends, setNotSelectedFriends] = useState<{ name: string, photoURL:string }[]>([]);
  const [notSelectedFriended, setNotSelectedFriended] = useState<{ name: string, photoURL:string }[]>([]);
  const [talkid, setTalkid] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [apoAddVisible, setApoAddVisible] = useState(false);
  const [promises, setPromises] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 }); // 緯度経度
  const [locationname, setLocationname] = useState(''); // 住所
  const [showlocation, setShowlocation] = useState(''); // 住所
  const [showappointer, setShowappointer] = useState([]); // 住所
  const [showApopromiseModalVisible, setShowApopromiseModalVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [appointer, setAppointer] = useState([]);
  const [showhostname, setShowhostname] = useState('');
  const [like,setLike] = useState([]);
  const [showStar, setShowStar] = useState(true);

  //ヘッダー消去
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);


  // 緯度経度から住所を取得する処理
  const Locationer = async (location) => {
    const baseURL = 'https://map.yahooapis.jp/geoapi/V1/reverseGeoCoder?output=json&';
    const APP_ID = process.env.YAHOO_API_KEY;
    const lat = location['latitude'];
    const lon = location['longitude'];
    const URL = `${baseURL}lat=${lat}&lon=${lon}&appid=${APP_ID}`;
    try {
      const response = await axios.get(URL);
      const jsonData = response.data;
      if (jsonData['ResultInfo']['Count'] == 0) {
        alert('データを取得できませんでした。');
      } else {
        const adrs = jsonData['Feature'][0]['Property']['Address'];
        setLocationname(adrs);
        setLocation(location);
      }
    } catch (error) {
      console.error(error);
    }

  };

  const FriendModalVisible = () => {
    setFriendModalVisible(false)
    setSelectnowFriends([])
  };

  const FriendModalVisibled = () => {
    setFriendModalVisibled(false)
    // setSelectnowFriends([])
  };

  const inviteFriend = async () => {
      const user = auth.currentUser;
      const inviterList = selectnowFriends.map((friend) => ({ name: friend.name }));
      const invList = [ ...showInviter, ...inviterList];
      
      const docRef = await updateDoc(doc(firestore, 'newAppo', showhostname), {
        inviter: invList,
      });
      setFriendModalVisibled(false);
      setShowApoModalVisible(false);
      setSelectnowFriends([]);
      // showをしなおす
    }  

  const showMapIos = (locate) => {
    const openAppleMapsDirections = (latitude, longitude) => {
      const destination = `${latitude},${longitude}`;
      Linking.openURL(`http://maps.apple.com/?daddr=${destination}`);
    };
    openAppleMapsDirections(locate['latitude'], locate['longitude']);
  }


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
      const friends: { name: string, id:string, photoURL:string }[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docs) => {
          const querySnapshot = doc(firestore, 'users', docs.get('frienduid'));
          const userSnap = await getDoc(querySnapshot);
          const userData = userSnap.data();
          const photoURL = userData?.photoURL;
          friends.push({ name: docs.get('friend'), id: docs.id, photoURL: photoURL } as { name: string, id:string, photoURL:string })
        });
      }
      setFriends(friends); // 新しい配列を作成して、それをfriendsに設定する
    });
    return () => {
      listfriend();
    };
  }, []);

  // トークルームに遷移する処理
  const navigation = useNavigation();
  const gototalkroom = (talkroomId: string) => {
    navigation.navigate('ルーム', { talkroomId });
    setShowApoModalVisible(false);
  };

  // カレンダーの月を変更したときの処理
  const handleMonthChange = (month: DateData) => {
    setSelectedMonth(new Date(month.timestamp));
  };

  // 検索ボックスのテキストが変更されたときappointmetsをフィルタリングする 
  useEffect(() => {
    const serch = appointments.filter(({ title, content }) => {
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

  // likeに保存されているidだけでリストを作るなおかつ時間が過ぎている物を除く　時間の昇順で並び替え appointmentsをfilterする
  useEffect(() => {
    const serch = appointments.filter(({ id }) => {
      return like.includes(id);
    });
    const likeAppointmets = serch
    .filter(({ appointmentDate }) => {
      const date = new Date(
        Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000
      );
      return date.getTime() - new Date().getTime() > 0;
    })
    .sort((a, b) => {
      const dateA = Number(a.appointmentDate['seconds']) * 1000 + Number(a.appointmentDate['nanoseconds']) / 1000000;
      const dateB = Number(b.appointmentDate['seconds']) * 1000 + Number(b.appointmentDate['nanoseconds']) / 1000000;
      return dateA - dateB;
    });

    setLikeAppointments(likeAppointmets);
  }, [like]);

  // お気に入りの処理
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
    const listpromise = async () =>
    {const userRef = doc(firestore, 'users', user.uid);
        const docSnapshot = await getDoc(userRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData && userData.Like) {
            setLike(userData.Like);
          }
        } else {
          setLike([]);
        }}
    listpromise();
  }
  , [setLike]);

  //お気に入りに追加
  const toggleLike = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
    const userRef = doc(firestore, 'users', user.uid);
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      if (userData && userData.Like) {
        const newLike = userData.Like.includes(id)
          ? userData.Like.filter((like) => like !== id)
          : [...userData.Like, id];
        await updateDoc(userRef, {
          Like: newLike,
        });
        setLike(newLike);
      } else {
        await updateDoc(userRef, {
          Like: [id],
        });
        setLike([id]);
      }
    } else {
        await setDoc(userRef, {
          Like: [id],
        });
        setLike([id]);
      }
  };

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

  const Apoinviter = () => {
    //invfriendに遷移する処理
    navigation.navigate('招待' as never);
  }

  useEffect(() => {
    const user = auth.currentUser;
    const q = query(collection(firestore, `newAppo`), where('inviter', 'array-contains', {name: user.displayName}));
    const listpromise = onSnapshot(q, (querySnapshot) => {
      const promises = [];
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
  , [setPromises]);

  // 招待する友達を選択する処理
  function inviteSelectedFriends() {
    const notedSelectedFriends = friends.filter((friend) => {
      return !selectedFriends.some((selectedFriend) => selectedFriend.name === friend.name);
    });
    setNotSelectedFriends(notedSelectedFriends);
    // 招待する処理     
    };
  
    // 詳細の方の招待する友達を選択する処理
  function inviteSelectedFriended() {
    // friendsからappointerとinviterを除いた物をsetNotSelectedFriendedに入れる
    const friendselect = friends.filter((friend) => {
      return !appointer.some((appointer) => appointer.name === friend.name);
    });
    const friendselects = friendselect.filter((friend) => {
      return !showInviter.some((inviter) => inviter.name === friend.name);
    });
    setNotSelectedFriended(friendselects);

    }

  // 選択されたフレンドをsekectedFriendsから削除する処理
  function notinviteSelectedFriends(friend) {
    const notedSelectedFriends = selectedFriends.filter((selectedFriend) => {
      return selectedFriend.name !== friend.name;
    });
    setSelectedFriends(notedSelectedFriends);
    // 招待を取り消す処理
  };

 // friendを複数選択して招待する処理
 const toggleFriendSelection = (friend) => {
  if (selectnowFriends.includes(friend)) {
    setSelectnowFriends(selectnowFriends.filter((selectedFriend) => selectedFriend !== friend));
  } else {
    setSelectnowFriends([...selectnowFriends, friend]);
  }
};

  // ここで選択された友達を招待する処理を実装する
  const inviteAllFriends = () => {
    const newSelectedFriends = [...selectedFriends, ...selectnowFriends];
    setSelectedFriends(newSelectedFriends);
    setSelectnowFriends([]);
    setFriendModalVisible(false);
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

  const handleDateChangeEnd = (date: Date) => {
    setShowDatePickerEnd(false);
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      selectedDateEnd.getHours(),
      selectedDateEnd.getMinutes()
    );
    setSelectedDateEnd(newDate);
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

  const handleTimeChangeEnd = (time: Date) => {
    setShowTimePickerEnd(false);
    const newDate = new Date(
      selectedDateEnd.getFullYear(),
      selectedDateEnd.getMonth(),
      selectedDateEnd.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    setSelectedDateEnd(newDate);
  };

  //記事をスクロールで下げれる 離したときに下がりきるようにしたい
  const handleScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollEnabled(true);
    if (offsetY < -120) {
      setShowApoModalVisible(false);;
    }
  };

  const handlePressDate = () => {
    setShowDatePicker(true);
  };

  const handlePressDateEnd = () => {
    setShowDatePickerEnd(true);
  };

  const handlePressTime = () => {
    setShowTimePicker(true);
  };

  const handlePressTimeEnd = () => {
    setShowTimePickerEnd(true);
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedFriends([]);
    setSelectnowFriends([]);
    setSelectedDate(new Date());
    setModalVisible(false);
    setFriendModalVisible(false);
    setLocation({ latitude: 0, longitude: 0 })
    setLocationname('')
    setSelectedFriends([]);
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
    if (!title) {
      Alert.alert('エラー', '約束名を入力してください');
      return;
    }
    if (selectedDate > selectedDateEnd) {
      Alert.alert('エラー', '開始日時が終了日時よりも前になっています');
      return;
    }
    try {
      const randamid = Math.random().toString(32).substring(2);
      const inviterList = selectedFriends.map((friend) => ({ name: friend.name }));
      const appointerList = [{ name: user.displayName }];
      const docRef = await addDoc(collection(firestore, 'newAppo'), {
        hostname: user.uid,
        inviter: inviterList,
        appointer: appointerList,
        title: title,
        content: content,
        talkroomid: randamid,
        location: [locationname,location],
        appointmentDate: selectedDate,
        appointmentDateEnd: selectedDateEnd,
        createdAt: new Date(),
      });
      // firestoreにtalkroomを作成
      const talkroomRef = collection(firestore, `talkroom/${randamid}/title`)
      const talkroomdocRef = await addDoc(talkroomRef, {
        talktitle:title,
      });

      // 手元のカレンダーに追加
      const eventDetails = {
        title: title, // 予定のタイトル
        startDate: selectedDate,
        endDate: selectedDateEnd,
        timeZone: 'Asia/Tokyo', // タイムゾーン
        location: locationname, // 場所
        notes: content, // メモ
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
      setTitle(''); // タイトルをクリアする
      setContent(''); // コンテンツをクリアする
      setSelectedDate(new Date()); // 日付を初期化する
      setModalVisible(false); // モーダルを閉じる
      setSelectedFriends([]);
      setSelectnowFriends([]);
      setFriendModalVisible(false);
      setLocation({ latitude: 0, longitude: 0 })
      setLocationname('')
      setSelectedFriends([]);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setModalVisible(false); 
  };

  // 約束を選択したときの処理
  const setSelectedApo = (id: string, hostname:string,apointer:[], title: string, appointmentDate: string,appointmentDateEnd:string, content: string, inviter: [], location:string, talkroomid:string, createAt:DateData) => {
    const date = new Date(
      Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000
    );
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 0から始まるため +1
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    //appointmentDateEndのDateDataを解析してstringにする
    const dateEnd = new Date(
      Number(appointmentDateEnd['seconds']) * 1000 + Number(appointmentDateEnd['nanoseconds']) / 1000000
    );
    const yearEnd = dateEnd.getUTCFullYear();
    const monthEnd = dateEnd.getUTCMonth() + 1; // 0から始まるため +1
    const dayEnd = dateEnd.getUTCDate();
    const hoursEnd = dateEnd.getUTCHours();
    const minutesEnd = dateEnd.getUTCMinutes();
    const secondsEnd = dateEnd.getUTCSeconds();
    const formattedDateEnd = `${yearEnd}-${monthEnd < 10 ? '0' : ''}${monthEnd}-${dayEnd < 10 ? '0' : ''}${dayEnd} ${hoursEnd < 10 ? '0' : ''}${hoursEnd}:${minutesEnd < 10 ? '0' : ''}${minutesEnd}`;
    //appointmentDateのDateDataを解析してstringにする

    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ~ ${formattedDateEnd}`;
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
    const talkidnow = talkroomid
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }

    //これらのデータをuseStateに入れる
    setShowApoDate(formattedDate);
    setShowTitle(title);
    setShowhostname(id);
    setAppointer(apointer);
    setShowContent(content);
    setShowInviter(inviter);
    setShowTalkroomid(talkroomid);
    setShowlocation(location);
    setShowappointer(apointer);
    setShowCreateAt(formattedCreateAtDate);
    setShowApoModalVisible(true);
    setTalkid(talkidnow)
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
      const appointments: { id: string; hostname:string; appointer:[]; title: string; content: string; appointmentDate: string; appointmentDateEnd:string; inviter:[]; location:string;talkroomid:string;createAt:DateData}[] = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // 終了時間を過ぎていないものを表示
          if ((data.hostname === user.uid || (data.appointer && data.appointer.some((inviterObj) => inviterObj.name === user.displayName))) && (new Date(Number(data.appointmentDateEnd['seconds']) * 1000 + Number(data.appointmentDateEnd['nanoseconds']) / 1000000).getTime() > new Date().getTime())) {
              appointments.push({
                id: doc.id,
                hostname: data.hostname,
                appointer: data.appointer,
                title: data.title,
                content: data.content,
                appointmentDate: data.appointmentDate,
                appointmentDateEnd: data.appointmentDateEnd,
                inviter: data.inviter,
                location: data.location,
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
                <Modal
                transparent={true}
                visible={showApopromiseModalVisible}
                animationType='slide'
                onRequestClose={() => {
                  setShowApopromiseModalVisible(false);
                }}
                
                >
                <View style={styles.apoinvView}>
                  <View style={styles.apoinvHeader}>
                    <Text style={styles.invHeaderText}>約束している人</Text>
                    <TouchableOpacity style={styles.closeButtonX} onPress={() => {
                      setShowApopromiseModalVisible(false);
                    }}>
                      <Ionicons name="close" size={30} color="black" />
                    </TouchableOpacity>
                  </View>
                    {/* appointerを約束している人 inviterが現在招待する人で同時に表示する */}
                  <View style={{ height: 370 }}>
                    <ScrollView>
                      {showappointer.map((friend) => (
                        <TouchableOpacity key={friend.name} style={{ marginLeft:30,  flexDirection:'row', alignItems:'center'}}>
                          <Ionicons name="person-circle-outline" style={{ left: '3%' }} size={65} color={'gray'} />
                          <Text style={{ marginLeft: '4%', fontWeight: 'bold', fontSize: 20 }}>{friend.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <Text style={styles.invnowText}>現在招待中の人</Text>
                  <View style={{ height: 370  }}>
                    <ScrollView>
                      {showInviter.map((friend) => (
                          <TouchableOpacity key={friend.name} style={{ marginLeft:30,  flexDirection:'row', alignItems:'center'}}>
                            <Ionicons name="person-circle-outline" style={{ left: '3%' }} size={65} color={'gray'} />
                            <Text style={{ marginLeft: '4%', fontWeight: 'bold', fontSize: 20 }}>{friend.name}</Text>
                          </TouchableOpacity>
                        ))}
                        {showappointer.length === 0 && (
                          <Text style={{ color: 'gray', marginTop:'80%'}}>約束している人はいません</Text>
                        )}
                    </ScrollView>
                  </View>
                </View>
              </Modal>

                  <Modal
                transparent={true}
                visible={friendModalVisibled}
                onRequestClose={() => {
                  setFriendModalVisibled(false);
                }}
              >
                <View style={styles.centeredViewNewApo}>
                  <View style={styles.modalViewNewApo}>
                    <Text style={styles.modalTitle}>招待する友達を選択してください</Text>
                    <ScrollView style={styles.friendscroll}>
                    {notSelectedFriended.map((friend, index) => (
                      <TouchableOpacity key={index} onPress={() => toggleFriendSelection(friend)}>
                        <View style={{ flexDirection: 'row',  justifyContent:'space-between', alignItems:'center' }}>
                        <View style={styles.friendRow}>
                          {/* アイコン表示無かったらデフォルトアイコン */}
                          {friend.photoURL ? (
                            <Image source={{ uri: friend.photoURL }} style={styles.friendImage} />
                          ) : (
                              <Ionicons name="person-circle-outline" size={74} style={styles.Imagedef} color={'gray'} />
                          )}
                          <Text style={styles.friendName}>{friend.name.length > 10 ? friend.name.slice(0, 10) + '...' : friend.name}</Text>
                        </View>
                        <Ionicons
                              name={selectnowFriends.some((friendObject) => friendObject.name === friend.name) ? 'checkbox' : 'checkbox-outline'}
                              size={25}
                              style={{ marginRight :35, marginBottom:7 }}
                              color={selectnowFriends.some((friendObject) => friendObject.name === friend.name) ? 'black' : 'gray'}
                            />
                        </View>
                      </TouchableOpacity>
                    ))}
                    {/* notSelectedFriendedが空だったら表示する */}
                    {notSelectedFriended.length === 0 && (
                      <Text style={{ color: 'gray', marginTop:'60%', textAlign:'center', fontSize:20}}>招待出来る友達がいません</Text>
                    )}
                    </ScrollView>
                    <TouchableOpacity style={styles.inviteButton} onPress={inviteFriend}>
                      <Text style={styles.inviteButtonText}>招待する</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButtons} onPress={() => FriendModalVisibled()}>
                      <Text style={styles.closeButtonTexts}>閉じる</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
          <ScrollView style={styles.centeredView} showsVerticalScrollIndicator={false} scrollEventThrottle={0.1} onScroll={(event) => {
            const y = event.nativeEvent.contentOffset.y;
            if (y > 0) {
              // 下方向へのスクロールがある場合、スクロール位置を0に戻す
              scrollViewRefs.current.scrollTo({ x: 0, y: 0, animated: false });
            }
            }} ref={scrollViewRefs} onScrollEndDrag={handleScrollEnd} >
              <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>約束の詳細</Text>
                <TouchableOpacity style={styles.closeButtonXs} onPress={() => {
                  setShowApoModalVisible(false);
                }}>
                  <Ionicons name="close" size={30} color="black" />
                </TouchableOpacity>
              </View>
                <View style={styles.likeedit} >
                  <TouchableOpacity style={styles.item} onPress={() => {
                  toggleLike(showhostname);
                }}>
                    {/* 星枠のアイコン */}
                    {like.some((like) => like === showhostname) ? (
                      <View>
                        <Ionicons name="star" size={30} color="yellow" />
                        <Ionicons style={{ position:'absolute' }} name="star-outline" size={31} color="black" />
                      </View>  
                    ) : (
                        <Ionicons name="star-outline" size={30} color="black" />
                    )}  
                    
                    <Text style={styles.label}>お気に入り</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.item} onPress={() => {
                  setShowApopromiseModalVisible(true);
                }}>
                  <Ionicons name="person" size={30} color="black" />
                    <Text style={styles.label}>約束している人</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.item} onPress={() => {
                  setFriendModalVisibled(true);
                  inviteSelectedFriended()
                }}>
                    {/* 招待のアイコン */}
                    <Ionicons name="md-person-add" size={30} color="black"/>
                    <Text style={styles.label}>招待</Text>
                  </TouchableOpacity>
                </View>
              <View>
                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop:'5%'}}>画像</Text>
                <View style={ styles.lightLine } />
                <View style={ styles.lightLine2 } />
                <TouchableOpacity style={ styles.talkroomRef } onPress={() => gototalkroom(talkid)}>
                  <Text style={{ color:'blue', fontSize:25, textAlign: 'center', }}>
                    トークルームに入る</Text>
                </TouchableOpacity>
              </View>
                <Text style={ styles.headtitle }>約束名</Text>
                <Text style={styles.detail}>{showTitle}</Text>
                <Text style={ styles.headtitle }>日付</Text>
                <Text style={styles.detail}>{showApoDate}</Text>
                <Text style={ styles.headtitle }>詳細</Text>
                <Text style={styles.detail}>{showContent || '未設定'}</Text>
                <Text style={ styles.headtitle }>場所</Text>
                <Text style={styles.detail}>{showlocation[0] || '未設定'}</Text>
                { showlocation[0] &&
                  <TouchableOpacity onPress={() => showMapIos(showlocation[1])}><Text style={{ color:'blue', marginLeft:14 }}>マップで確認する</Text></TouchableOpacity>
                }
                {/* <Text>{showContent}</Text> まだ */}
                <Text style={ styles.headtitle }>招待者:{showInviter.map((inviter) => (
                  // 13文字以降...
                  <Text key={inviter.name}>{inviter.name.length > 13 ? inviter.name.slice(0, 13) + '... ' : inviter.name + ' '}</Text>
                ))}</Text>
                <Text style={ styles.headtitle }>作成日:{showCreateAt ? showCreateAt.toLocaleString() : '日付不明'}</Text>
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
                <Text style={styles.modalTitle}>招待する友達を選択してください</Text>
                <ScrollView style={styles.friendscroll}>
                {notSelectedFriends.map((friend, index) => (
                  <TouchableOpacity key={index} onPress={() => toggleFriendSelection(friend)}>
                    <View style={{ flexDirection: 'row',  justifyContent:'space-between', alignItems:'center' }}>
                    <View style={styles.friendRow}>
                      {/* アイコン表示無かったらデフォルトアイコン */}
                      {friend.photoURL ? (
                        <Image source={{ uri: friend.photoURL }} style={styles.friendImage} />
                      ) : (
                          <Ionicons name="person-circle-outline" size={74} style={styles.Imagedef} color={'gray'} />
                      )}
                      <Text style={styles.friendName}>{friend.name.length > 10 ? friend.name.slice(0, 10) + '...' : friend.name}</Text>
                    </View>
                    <Ionicons
                          name={selectnowFriends.some((friendObject) => friendObject.name === friend.name) ? 'checkbox' : 'checkbox-outline'}
                          size={25}
                          style={{ marginRight :35, marginBottom:7 }}
                          color={selectnowFriends.some((friendObject) => friendObject.name === friend.name) ? 'black' : 'gray'}
                        />
                    </View>
                  </TouchableOpacity>
                ))}
                </ScrollView>
                <TouchableOpacity style={styles.inviteButton} onPress={inviteAllFriends}>
                  <Text style={styles.inviteButtonText}>招待する</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButtons} onPress={() => FriendModalVisible()}>
                  <Text style={styles.closeButtonTexts}>閉じる</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={showMap}
            onRequestClose={() => {
              setShowMap(false);
            }}>
              <MapScreen onLocationSelect={(location) => Locationer(location)} onselect={(bool) => setShowMap(bool)} />
          </Modal>
          <View style={styles.centeredViewNewApo}>
            <View style={styles.modalViewNewApo}>
              <View style={{ width: '100%', marginTop:'7%', flexDirection:'row', justifyContent:'space-between' }}>
                <Text style={{ fontSize:27, fontWeight: 'bold', textAlign:'left', paddingLeft:'5%' }}>約束の作成</Text>
                <TouchableOpacity onPress={handleSave}>
                  <Text style={{ fontSize:25,fontWeight:'bold', color: '#0030ce', marginRight: 15 }}>作成</Text>
                  </TouchableOpacity>
              </View>
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
            <DateTimePickerModal
              isVisible={showDatePickerEnd}
              mode="date"
              onConfirm={handleDateChangeEnd}
              onCancel={() => setShowDatePickerEnd(false)}
              locale="ja"
            />
            <DateTimePickerModal
              isVisible={showTimePickerEnd}
              mode="time"
              onConfirm={handleTimeChangeEnd}
              onCancel={() => setShowTimePickerEnd(false)}
              locale="ja"
            />
              <View style={{ width: '100%', paddingTop:'6%' }}>
                  <TextInput
                    style={styles.input1}
                    onChangeText={setTitle}
                    value={title}
                    placeholder="約束名を入力してください"
                  />
                <Text style={{ paddingTop:'5%', paddingLeft:'5%', fontWeight:'bold', fontSize:20 }}>日時: </Text>
                <View style={{ paddingLeft:'6%' }}>
                  <View style={{ flexDirection: 'row', paddingLeft:'3%' }}>
                    <Text style={{ fontWeight:'bold', fontSize:20 }} onPress={handlePressDate}>{selectedDate.toLocaleDateString("ja-JP")}</Text>
                    <Text style={{ fontWeight:'bold', fontSize:20 }} onPress={handlePressTime}> {selectedDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={{ fontSize:20, fontWeight:'bold', paddingLeft:'40%'}}> ～</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight:'bold', fontSize:20, paddingLeft:'43%' }}  onPress={handlePressDateEnd}>{selectedDateEnd.toLocaleDateString("ja-JP")}</Text>
                    <Text style={{ fontWeight:'bold', fontSize:20  }}  onPress={handlePressTimeEnd}> {selectedDateEnd.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
                  <View style={[styles.likeedits,{ paddingTop:'5%' }]} >
                    <TouchableOpacity style={styles.item} onPress={() => {setFriendModalVisible(true); inviteSelectedFriends() }}>
                      <Ionicons name="md-person-add" size={30} color="black" />
                      <Text style={styles.label}>招待</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={() => setShowMap(true)}>
                      <Ionicons name="location-sharp" size={30} color="black" />
                      <Text style={styles.label}>場所</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                      <Ionicons name="camera" size={30} color="black" />
                      <Text style={styles.label}>画像</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: '100%' }}>
                    <Text style={styles.selectFriend}>選択されたフレンド</Text>
                      <View style={styles.friendinv}>
                        {/* 右にスクロール */}
                        <ScrollView 
                        style={styles.iconbox} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={true} 
                        scrollIndicatorInsets={{ top: 1 }}
                        >
                        {/* +のアイコンを表示するアイコンの周りは丸で囲む*/}
                        <View style={styles.iconname}>
                          <TouchableOpacity style={styles.icon} onPress={() => {setFriendModalVisible(true); inviteSelectedFriends() }}>
                            {/* ただの＋でいい */}
                            <Ionicons name="add" size={45} color="black" />
                          </TouchableOpacity>
                          <Text style={{ textAlign:'center' }}>追加</Text>
                        </View>
                            {selectedFriends.map((friend) => (
                              <View style={styles.iconname} key={friend.name}>
                                <TouchableOpacity style={styles.icon} onPress={() => { notinviteSelectedFriends(friend) }}>
                                  {/* ユーザーアイコンを表示する無ければデフォルトアイコンを表示する */}
                                  {friend.photoURL ? (
                                    <Image source={{ uri: friend.photoURL }} style={styles.friendIcon} />
                                  ) : (
                                    <Ionicons name="person" size={45} color="black" />
                                  )}
                                  {/* 右上に丸い罰ボタンを追加する */}
                                  <View style={styles.closeIcon}>
                                    <Ionicons name="close" size={15} color="#3f3f3f" />
                                  </View>
                                </TouchableOpacity>
                                {/* friend.nameは4文字で改行して２行目の３文字まで表示して...を付け加える */}
                                <Text style={{ textAlign:'center' }}>{friend.name.length > 7 ? friend.name.slice(0,7)+ '...' : friend.name}</Text>
                              </View>
                            ))}
                        </ScrollView>
                      </View>
                      {location && (
                        <View>
                          <Text style={styles.selectLocate}>選択された場所</Text>
                          <View style={{ height: 30, marginBottom:5 }}>
                            <Text style={styles.unknowntext}>{locationname || '未設定'}</Text>
                          </View>
                        </View>
                      )}
                      <TextInput
                      style={styles.input2}
                      onChangeText={setContent}
                      value={content}
                      multiline={true}
                      placeholder="詳細を入力してください"
                      numberOfLines={4}
                      />
                    <View style={styles.buttonfield}>
                      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                        <Text style={styles.closeButtonText}>閉じる</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
            </View>
            </View>
          </View>
        </Modal>
        <ScrollView bounces={false} contentContainerStyle={styles.scrollContainer} style={{height: calendarVisible ? '54%' : '92%'}} ref={scrollViewRef}>
        {/* 約束表示 */}
        {/* {appointments.map((appointment) => (
          <View style={styles.contain}>
          <Text style={styles.title}>{appointment.title}</Text>
          <Text style={styles.content}>{appointment.content}</Text>
        </View>
        ))} */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchIconContainer} onPress={() => {setSearchVisible(true),setShowStar(false)}}>
            <Ionicons name="search" size={20} color="black" />
          </TouchableOpacity>
          
            {/* trueだったら黒枠にする */}
            {showStar ? star ? (
              <TouchableOpacity style={styles.searchIconContainer} onPress={() => setStar(!star)}>
              <View>
                <Ionicons name="star" size={20} color="yellow" />
                <Ionicons style={{ position: 'absolute', top: 0, left: 0 }} name="star-outline" size={20} color="black" />
              </View>  
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.searchIconContainer} onPress={() => setStar(!star)}>
                <Ionicons name="star-outline" size={20} color="black" />
              </TouchableOpacity>
            ) : null}
            

          {searchVisible && (
            <View style={styles.searchBoxContainer}>
            <TextInput
              style={styles.searchBox}
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.closeIconContainer} onPress={() => {
                setSearchText('');
                setSearchVisible(false)
                setShowStar(true)
              }}>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.ApoIconContainer} onPress={() => Apoinviter()}>
            <Ionicons name="md-add-circle" size={20} color="black" />
          </TouchableOpacity>
          {/* inniconsの右上にLineの通知のように数を表示する                                            */}
          {promises.length >= 1 && !searchVisible && (
            <View style={styles.notificationIconContainer}>
              <Text style={styles.notificationBadgeText}>{promises.length}</Text>
            </View>
          )}
        </View>
        {/* // filteredAppointmentsからすべてまとめたfilteredAppointment */}
        {((!searchText && !star) && (filteredAppointments.length > 0 ? (filteredAppointments.map(({ id, hostname,appointer,title, appointmentDate, appointmentDateEnd, content , inviter, location , talkroomid, createAt}) => (
          <TouchableOpacity style={styles.contain} key={id} onPress={() => setSelectedApo(id, hostname,appointer,title, appointmentDate,appointmentDateEnd, content , inviter, location , talkroomid, createAt)} >
            <View style={{ flexDirection: 'row',height:'100%' }}>
              <View>
                <Text style={styles.contenttime}>{
                  // 時間がマイナスなら赤色にする
                  Math.floor((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 0 ?
                  <Text style={{ color:'red' }}>
                  現在約束中
                  </Text>
                  :
                  <Text>
                  {Math.floor((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60))}時間{
                  Math.floor(((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60)) % 60)}分
                  </Text>
                }</Text>
              </View>
              <View style={styles.ibar}></View>
              <View>
                <Text style={styles.title}>{title.length > 14 ? title.slice(0,14)+ '...' : title}</Text>
                <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start' }}>
                  <View style={{ marginLeft:3, width:160 }}>
                    <Text style={styles.content}>開始:{new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</Text>
                    {appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(appointmentDateEnd['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                  </View>
                  <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%', marginLeft:40 }}>
                    <Ionicons name="md-pin" size={18} color="#900" />
                    {/* locationの頭三文字を表示 */}
                    <Text>{location[0] ? location[0].slice(0,3)+ '...' : '未設定   '}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))) : (
          // 今月の約束はありません
          <View style={styles.noAppointmentContainer}>
            <Text style={styles.noAppointmentText}>
              {selectedMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric' })}
            月の約束はありません</Text>
          </View>
        )))}
        {((searchText && star) && (serchAppointments.length > 0 ? (serchAppointments.map(({ id, hostname,appointer,title, appointmentDate, appointmentDateEnd, content , inviter,location, talkroomid, createAt}) => (
          <TouchableOpacity style={styles.contain} key={id} onPress={() => setSelectedApo(id, hostname, appointer, title, appointmentDate,appointmentDateEnd, content , inviter, location,talkroomid, createAt)} >
            <View style={{ flexDirection: 'row', height:'100%' }}>
              <View>
                <Text style={styles.contenttime}>{
                  // 時間がマイナスなら赤色にする
                  Math.floor((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 0 ?
                  <Text style={{ color:'red' }}>
                  現在約束中
                  </Text>
                  :
                  <Text>
                  {Math.floor((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60))}時間{
                  Math.floor(((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60)) % 60)}分
                  </Text>
                }</Text>
              </View>
              <View style={styles.ibar}></View>
              <View>
                {/* 現在は１４文字以降は検索に引っかからない */}
                <Text style={styles.title}>{title.length > 14 ? highlightText(title.slice(0,14) + '...',searchText) : highlightText(title, searchText)}</Text>
                <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start' }}>
                  <View style={{ marginLeft:3, width:160}}>
                    <Text style={styles.content}>開始:{new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
                    {appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(appointmentDateEnd['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                  </View>
                  <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end',width:'30%', marginLeft:40}}>
                    <Ionicons name="md-pin" size={18} color="#900" />
                    <Text>{location[0] ? location[0].slice(0,3)+ '...' : '未設定   '}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))) : (
          // 今月の約束はありません
          <View style={styles.noAppointmentContainer}>
            <Text style={styles.noAppointmentText}>
              {selectedMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric' })}
            月の約束はありません</Text>
          </View>
        )))}

        {/* starがオンだったらlikeAppointmentsを表示 */}
        {((!searchText && star) && (likeAppointments.length > 0 ? (likeAppointments.map(({ id, hostname,appointer,title, appointmentDate, appointmentDateEnd, content , inviter, location , talkroomid, createAt}) => (
          <TouchableOpacity style={styles.contain} key={id} onPress={() => setSelectedApo(id, hostname,appointer,title, appointmentDate,appointmentDateEnd, content , inviter, location , talkroomid, createAt)} >
            <View style={{ flexDirection: 'row',height:'100%' }}>
              <View>
                <Text style={styles.contenttime}>{
                  // 時間がマイナスなら赤色にする
                  Math.floor((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60)) < 0 ?
                  <Text style={{ color:'red' }}>
                  現在約束中
                  </Text>
                  :
                  <Text>
                  {Math.floor((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60))}時間{
                  Math.floor(((new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60)) % 60)}分
                  </Text>
                }</Text>
              </View>
              <View style={styles.ibar}></View>
              <View>
                <Text style={styles.title}>{title.length > 14 ? title.slice(0,14)+ '...' : title}</Text>
                <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start' }}>
                  <View style={{ marginLeft:3, width:160 }}>
                    <Text style={styles.content}>開始:{new Date(Number(appointmentDate['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</Text>
                    {appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(appointmentDateEnd['seconds']) * 1000 + Number(appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
                  </View>
                  <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%', marginLeft:40 }}>
                    <Ionicons name="md-pin" size={18} color="#900" />
                    {/* locationの頭三文字を表示 */}
                    <Text>{location[0] ? location[0].slice(0,3)+ '...' : '未設定   '}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))) : (
          // 今月の約束はありません
          <View style={styles.noAppointmentContainer}>
            <Text style={styles.noAppointmentText}>
            お気に入りはありません</Text>
          </View>
        )))}
        
        


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

export default ApoScreen;