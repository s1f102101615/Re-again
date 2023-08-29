import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
          <Text style={styles.header}>Talk Room {talkroomId}</Text>
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
              <View>
                <View style={styles.iconContainer}>
                  <Image
                    source={{ uri: message.icon }}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageInfo}>{message.name} ({message.uid})</Text>
              </View>
            ) : (
              <>
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageInfo}>{message.name} ({message.uid})</Text>
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