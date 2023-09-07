import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { PermissionStatus, requestCameraPermissionsAsync } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraType } from 'expo-camera/build/Camera.types';

export default function QRmode() {
  const [scanned, setScanned] = useState(false);
  const [friendsearchmodal, setFriendSearchModal] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const handleScan = (e: any) => {
    console.log(e.data);
    setFriendSearchModal(true);
    setScanned(true);
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
                <Text style={styles.textfriend}>QRコードをスキャンしました！</Text>
            </View>
            <Button
              title="ああああああああああああああ"
              onPress={() => {
                setFriendSearchModal(false);
              }}
            ></Button>
            


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
    flex: 1,
    marginTop: 350,
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