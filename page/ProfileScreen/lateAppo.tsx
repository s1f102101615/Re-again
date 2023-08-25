import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const [user, setUser] = useState<User>();
  const [displayName, setDisplayName] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);


  const navigator = useNavigation();
 


  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        // const count = await getFriendsCount(user.uid);
        setFriendsCount(3);
      } else {
        setUser(undefined);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
    }
  }, []);



  // lateappoは後で実装する
  return (
    <View style={styles.container}>
      {lateappo.map((lateappo) => (
        <TouchableOpacity style={styles.contain} key={lateappo.id} onPress={() => {setSelectedLateappo(lateappo);setModalVisible(true);}} >
        <View style={{ flexDirection: 'row',height:'100%' }}>
        <Text style={styles.contenttime}>{
        Math.floor((new Date(Number(lateappo.appointmentDate['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60 * 60))
        }時間{
          Math.floor(((new Date(Number(lateappo.appointmentDate['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).getTime() - new Date().getTime()) / (1000 * 60)) % 60)
        }分</Text>
        <View style={styles.ibar}></View>
        <View>
          <Text style={styles.title}>{lateappo.title}</Text>
          <View style={{ marginTop:11, marginLeft:3 }}>
          <Text style={styles.content}>開始:{new Date(Number(lateappo.appointmentDate['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'  })}</Text>
          {lateappo.appointmentDateEnd && <Text style={ styles.content }>終了:{new Date(Number(lateappo.appointmentDateEnd['seconds']) * 1000 + Number(lateappo.appointmentDate['nanoseconds']) / 1000000).toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>}
          </View>
        </View>
        <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent: 'flex-end', width:'30%' }}>
          <Ionicons name="md-pin" size={18} color="#900" />
          <Text>場所</Text>
        </View>
        </View>
      </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  promise: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  promiseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contain: {
    backgroundColor: '#f7feff',
    height: 80,
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
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
  contenttime: {
    fontSize: 16,
    height: '100%',
    width: '27%',
    textAlign: 'center',
    paddingTop: '7%',
  },
  ibar: {
    width: '2%',
    height: '100%',
    backgroundColor: '#f13434',
    opacity: 0.2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 3,
  },
  content: {
    fontSize: 16,
  },
});

export default HomeScreen;
