import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { auth, firestore } from '../firebase';
import { collection, query, where, orderBy, addDoc, onSnapshot } from 'firebase/firestore';

const ApoScreen = () => {
  const [text, setText] = useState('');
  const [appointments, setAppointments] = useState([]);
  
  const handleSave = async () => {
    const user = auth.currentUser;
    try {
      const docRef = await addDoc(collection(firestore, 'newAppo'), {
        name: user.uid,
        title: '初めての約束',
        content: text
      });
      console.log('Document written with ID: ', docRef.id);
      setText(''); // テキストをクリアする
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    const q = query(collection(firestore, 'newAppo'), where('name', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointments);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text>Apo Screen</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
        onChangeText={setText}
        value={text}
        placeholder="Enter text"
      />
      <Button title="Save" onPress={handleSave} />
      {appointments.map((appointment) => (
        <View key={appointment.id}>
          <Text>{appointment.title}</Text>
          <Text>{appointment.content}</Text>
        </View>
      ))}
    </View>
  );
};

export default ApoScreen;