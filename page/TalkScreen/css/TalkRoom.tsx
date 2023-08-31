import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
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
      fontSize: 18,
    },
    messageInfo: {
      fontSize: 12,
      color: '#888',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#eee',
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: '#ddd',
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
      justifyContent: 'flex-start',
    },
    leftMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#eee',
      borderRadius: 8,
      marginVertical: 4,
      marginHorizontal: 8,
      maxWidth: '80%',
    },
    rightMessage: {
      alignSelf: 'flex-end',
      backgroundColor: 'lightblue', // 右寄せメッセージの背景色
      borderRadius: 8,
      marginVertical: 4,
      marginHorizontal: 8,
      maxWidth: '80%',
    },
    iconContainer :{
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#ccc',
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    messageEnemy: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconText :{
      fontSize: 16,
      fontWeight: 'bold',
    },
    iconImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  });

  export default styles;