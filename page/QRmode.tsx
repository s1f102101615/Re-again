import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { PermissionStatus, requestCameraPermissionsAsync } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraType } from 'expo-camera/build/Camera.types';
import { addDoc, collection, collectionGroup, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QRmode() {
  const [scanned, setScanned] = useState(false);
  const [friendsearchmodal, setFriendSearchModal] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [qrtrue, setQrtrue] = useState(false);
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState('');
  const [name, setName] = useState('');

  const handleScan = (e: any) => {
    // {"qrname":"いにあど海","qrdata":"re-again"}からqrnameを取り出す
    let qrname = null;
    let qrdata = null;
    try {
      qrname = JSON.parse(e.data).qrname;
      qrdata = JSON.parse(e.data).qrdata;
    } catch (e) {
      setFriendSearchModal(true);
      setQrtrue(false);
      setScanned(true);
      return;
    }
    if (qrdata === "re-again") {
      setFriendSearchModal(true);
      setfriend(qrname);
      setQrtrue(true);
      setScanned(true);
      return;
    }
    setQrtrue(false);
    setFriendSearchModal(true);
    setScanned(true);
  };

  const setfriend = async (name:string) => {
    const friend = await getUserUidByDisplayName(name);
    // users/friendのphotoURLを取得する処理
    const q = doc(firestore, `users/${friend}`);
    const userSnapshot = await getDoc(q);
    setIcon(userSnapshot.data().photoURL);  
    setName(name);  
  };


  const getUserUidByDisplayName = async (displayName) => {
    //displayNameからuserのuidを取得する処理
    const q = query(collectionGroup(firestore, 'profile'), where('displayName', '==', displayName.trim()));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    } else {
      const user = querySnapshot.docs[0].ref.parent.parent?.id;
      return user;
    }
  };

  const alreadyFriend = async (displayName) => {
    //displayNameがフレンドかを判定する処理
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const q = query(collection(firestore, `users/${user.uid}/friends`), where('friend', '==', displayName.trim()));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('いないよ')
      return false;
    } else {
      console.log('いるよ')
      return true;
    }
  };

  const handleSave = async (name:string) => {
    //フレンド申請を送る処理 
    const user = auth.currentUser;
    const enemy = await getUserUidByDisplayName(name);
    if  (!user){
      return;
    }
    if (name === user.displayName) {
      setMessage('自分にフレンド申請はできません。');
      return;
    }
    if (await alreadyFriend(name)) {
      setMessage('すでにフレンドです。');
    } else {
    if (enemy !== null) {
      const sentRequestsRef = collection(firestore, `users/${user.uid}/sentRequests`);
      const sentRequestsQuery = query(sentRequestsRef, where('sendRequest', '==', name));
      const sentRequestsSnapshot = await getDocs(sentRequestsQuery);
      if (sentRequestsSnapshot.size > 0) {
        setMessage(`すでに ${name} \nにフレンド申請を送っています。`);
      } else {
        try {
          const docRef = await addDoc(collection(firestore, `users/${user.uid}/sentRequests`), {
            sendRequest: name
          });
          const doRef = await addDoc(collection(firestore, `users/${enemy}/gotRequests`), {
            gotRequest: user.displayName,
            gotRequestuid: user.uid,
            getRequesticon: user.photoURL
          });
          setMessage(`${name} \nにフレンド申請を送りました!`);
        } catch (e) {
          setMessage('フレンド申請に失敗しました。');
        }
      }
      } else {
        setMessage('ユーザーが見つかりませんでした。');
      }
    };
    };
  
  useEffect(() => {
    (async () => {
      const { status } = await requestCameraPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    })();
  }, []);

  return (
    <><View style={styles.container}>
          {hasPermission === null ? (
              <Text>カメラの許可をリクエストしています...</Text>
          ) : hasPermission === false ? (
              <Text>カメラの許可がありません</Text>
          ) : (
              <Camera
                  style={styles.preview}
                  type={CameraType.back}
                  onBarCodeScanned={handleScan}
                  barCodeScannerSettings={{
                      barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                  }} />
          )}
      </View>
      <Modal
          transparent={true}
          visible={friendsearchmodal}
          onRequestClose={() => {
              setFriendSearchModal(false);
          } }
      >
            <View style={styles.containerfriend}>
                {qrtrue ? (
                  <>
                    <Text style={styles.textfriend}>フレンド申請を送りますか？</Text>
                    {icon ? (<Image source={{ uri: icon }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                    ) : (
                    <Ionicons name='ios-person' size={80} color='black' /> 
                    )}
                    
                    <Text style={styles.textname}>{name}</Text>
                    {/* message */}
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.friendbutton}>
                      <Button
                        title="フレンド申請を送る"
                        onPress={() => {
                          handleSave(name);
                        }}
                      ></Button>
                    </View>
                  </>
                ) : (
                  <Text style={styles.textfriend}>無効なQRです！</Text>
                )}
                 <View style={styles.textfriendbutton}>
                  <Button
                      title="戻る"
                      onPress={() => {
                        setFriendSearchModal(false);
                      }}
                    ></Button>
                  </View>
            </View>
            


        </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:'100%',
  },
  containerfriend: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:'100%',
    backgroundColor: 'white',
  },
  text: {
    flex: 1,
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textfriend: {
    marginTop: 370,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textname: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 12,
  },
  textfriendbutton: {
    flex: 1,
    marginTop: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendbutton: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});