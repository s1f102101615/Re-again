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
      padding: 5,
      marginVertical: 10,
      width: 230,
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
      fontSize: 18,
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
  });

  export default styles;