import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'react-native';
import styles from './css/TalkRoom';

const TalkRoom = () => {
  const [messages, setMessages] = useState<{ id: string; text: string; name: string; uid: string; createdAt: number; icon:string}[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const route = useRoute();
  const { talkroomId } = route.params as { talkroomId: string };
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const { uid, displayName } = user;
    // firestoreのusers.uidにあるphotoURLを取得
    const userRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    const { photoURL } = userSnapshot.data();
    const createdAt = Date.now();
    const message = { id: String(messages.length + 1), text: inputText, name: displayName, uid, createdAt, icon: photoURL };
    setMessages([...messages, message]);
    setInputText('');
    // firestoreのnewAppoにlastmessageを追加
    // newAppo中のtalkroomidと一致するものを探す
    const AppoRef = collection(firestore, 'newAppo');
    const aaa = await getDocs(query(AppoRef, where('talkroomid', '==', talkroomId)));
    // あったら更新無かったら作成する
    if (!aaa.empty) {
      const appoDoc = aaa.docs[0];
      await updateDoc(doc(collection(firestore, 'newAppo'), appoDoc.id), { newtalk: message.text });
    } else {
      await setDoc(doc(collection(firestore, 'newAppo')), { newtalk: message.text, talkroomid: talkroomId });
    }



    const talkroomRef = doc(firestore, 'talkroom', talkroomId);
    // docがあるならupdateDoc、ないならsetDoc
    const talkroomDoc = await getDoc(doc(collection(firestore, 'talkroom'), talkroomId));
    console.log(talkroomDoc.exists());
    if (talkroomDoc.exists()) {
        console.log('Document data:', talkroomDoc.data());
        await updateDoc(talkroomRef, { messages: [...talkroomDoc.data().messages, message] });
      } else {
        console.log('No such document!');
        await setDoc(talkroomRef, { messages: [message] });
      }
  };

  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.navigate('TalkRoomMenu', { talkroomId });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      if (!talkroomId) {
        return;
      }
      const messageRef = doc(firestore, 'talkroom', talkroomId);
      const messageSnapshot = await getDoc(messageRef);
      const data = messageSnapshot.data();
      const messages = [];
      if (data && data.messages) {
        data.messages.forEach((message) => {
            messages.push({ ...message });
        });
      }
      setMessages(messages);
    };
    fetchMessages();
  }, [talkroomId]);


  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.uid === auth.currentUser?.uid ? styles.rightMessage : styles.leftMessage,
            ]}
          >
            {message.uid !== auth.currentUser?.uid ? (
              <View style={styles.messageEnemy}>
                <View style={styles.iconContainer}>
                  <Image
                    source={{ uri: message.icon }}
                    style={styles.iconImage}
                  />
                </View>
                <View>
                  <Text style={styles.messageInfo}>{message.name} </Text>
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
              </View>
            ) : (
              <>
              <Text style={styles.messageText}>{message.text}</Text>
              </>
            )} 
            </View>))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TalkRoom;