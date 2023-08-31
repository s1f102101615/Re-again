import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      width:'100%',
    },
    profile: {
      flexDirection: 'row',
      marginBottom: 14,
      marginLeft: 34,
      marginTop: 12,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 18,
    },
    cameraIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 4,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginRight: 16,
    },
    info: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    infoItem: {
      marginRight: 16,
    },
    infoItemLabel: {
      fontSize: 16,
      color: '#666',
    },
    infoItemValue: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    friendList: {
      marginTop: 30,
      width: '100%',
    },
    friendListTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
  },
});

  export default styles;