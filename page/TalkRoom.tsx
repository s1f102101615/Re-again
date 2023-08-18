import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../firebase';
import { collection, doc, onSnapshot, getDoc, setDoc, updateDoc, arrayUnion, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const TalkRoom = () => {
  const [messages, setMessages] = useState<{ id: string; text: string; name: string; uid: string; createdAt: number }[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { talkroomId } = route.params as { talkroomId: string };

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const { uid, displayName } = user;
    const createdAt = Date.now();
    const message = { id: String(messages.length + 1), text: inputText, name: displayName, uid, createdAt };
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
  
  useEffect(() => {
    const fetchMessages = async () => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const { uid } = user;
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
        <Text style={styles.header}>Talk Room {talkroomId}</Text>
        {messages.map((message) => (
          <View
          key={message.id}
          style={[
            styles.message,
            message.uid === auth.currentUser?.uid ? styles.rightMessage : styles.leftMessage,
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
          <Text style={styles.messageInfo}>{message.name} ({message.uid})</Text>
        </View>
        ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  message: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
    
  },
  messageText: {
    fontSize: 16,
  },
  messageInfo: {
    fontSize: 12,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 16,
    padding: 8,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightblue', // 右寄せメッセージの背景色
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '80%',
  },
});

export default TalkRoom;