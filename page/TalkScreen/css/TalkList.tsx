import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height:'100%',
      width:'100%',
    },
    contain: {
      backgroundColor: '#fff',
      borderRadius: 10,
      height: 100,
      width: '90%',
      marginTop: 5,
      marginBottom: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
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
      bottom: '7%',
      right: 20,
      zIndex: 2,
    },
    content: {
      fontSize: 16,
    },
  });

  export default styles;