import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../firebase';
import { collection, doc, onSnapshot, query, setDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const TalkRoom = () => {
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<FlatList>(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { talkroomId } = route.params as { talkroomId: string };

  const handleSend = () => {
    // メッセージを送信する処理
    setMessages([...messages, { id: String(messages.length + 1), text: inputText }]);
    setInputText('');
  };
  const renderItem = ({ item }) => (
    <View style={styles.message}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );
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
      <FlatList
        ref={scrollViewRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Talk Room {talkroomId}</Text>}
        ListFooterComponent={
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
        }
        contentContainerStyle={styles.contentContainer}
      />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
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
});

export default TalkRoom;