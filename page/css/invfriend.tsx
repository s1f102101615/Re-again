import { StyleSheet } from 'react-native';

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
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalTitleAlarm: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 50,
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
      width: 100,
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
      marginLeft: 3,
      marginBottom: 14,
      marginTop:2
    },
    content: {
      fontSize: 16,
    },
    centeredViewNewApo: {
      flex: 1,
      backgroundColor: '#000000aa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalViewalarm: {
      backgroundColor: '#fff',
      borderRadius: 5,
      width: '60%',
      height: '40%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 5,
    },
    picker: {
      height: 100,
      width: 200,
      top: -25,
    },
    item : {
      color: 'blue',
    },
    closeButtonalarm: {
      marginTop: 80,
      backgroundColor: '#1f1f1f',
      borderRadius: 5,
      width: 120,
      height: 45,
      marginBottom: 13,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    closeButtonTexts: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
    },
  });

  export default styles;