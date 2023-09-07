import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
// import { PERMISSIONS, request } from '@react-native-community/permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function QRmode() {
  const [scanned, setScanned] = useState(false);

  const handleScan = (e: any) => {
    console.log(e.data);
    setScanned(true);
  };
  
//   useEffect(() => {
//     request(PERMISSIONS.IOS.CAMERA).then((result) => {
//       console.log('Camera permission:', result);
//     });
//   }, []);

  return (
    <View style={styles.container}>
      {/* <QRCodeScanner onRead={handleScan} /> */}
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={handleScan}
        captureAudio={false}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
        }}
        />
      {scanned && <Text style={styles.text}>QRコードをスキャンしました！</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});