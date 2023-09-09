import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor:'#fff',
    },
    input: {
      borderWidth: 1,
      padding: 5,
      marginVertical: 10,
      width: '80%',
    },
    input1: {
      borderWidth: 1,
      padding: 10,
      marginVertical: 10,
      fontSize: 20,
      width: 300,
    },
    request: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: '10%',
    },
    circle: {
      backgroundColor: '#00FF7F',
      borderRadius: 50,
      width: 64,
      height: 64,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circleContainer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    button: {
      backgroundColor: '#00FF7F',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#000000',
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    closeButtonQr: {
      backgroundColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      top: 20,
    },
    qrscantext: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4d4d4d',
      marginTop: 15,
    },
    myqrcode: {
      padding:10,
      marginTop: 20,
      borderWidth: 1,
      borderRadius: 20,
    },
    closeButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: '#fff',
      borderRadius: 5,
      width: '90%',
      padding: 45,
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
    modalText: {
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 22,
    },
    modalTextqr: {
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      color: '#001aff',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderColor: '#7f5df0',
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    tabText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    tabBadgeText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    tabBadge: {
      position: 'absolute',
      top: 5,
      right: 3,
      backgroundColor: 'red',
      borderRadius: 50,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    friendIcon: {
      width: 65,
      height: 65,
      borderRadius: 20,
      marginRight: 10,
    },
    modalQr: {
      backgroundColor: '#fff',
      width: '100%',
      height: '50%',
      alignItems: 'center',
    },
  });

  export default styles;