import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#fff',     
    },
    profileedit: {
      flexDirection: 'row', // 要素を横に並べる
      justifyContent: 'space-between', // 要素間のスペースを均等に分配
      paddingHorizontal: '15%', // 左右のパディング
      alignItems: 'center', // 縦方向に中央揃え
      marginTop: '4%',
    },
    postdouble: { 
      flexDirection: 'row', // 要素を横に並べる
      justifyContent: 'space-between', // 要素間のスペースを均等に分配
      paddingHorizontal: '5%', // 左右のパディング
      marginTop: '3%',
      height: '15%', 
      marginBottom: '3%', 
    },
    settinglist: {
      flexDirection: 'row', // 要素を横に並べる
      justifyContent: 'space-between', // 要素間のスペースを均等に分配
      paddingHorizontal: '1%', // 左右のパディング
      alignItems: 'center', // 縦方向に中央揃え
      flexWrap: 'wrap', // 要素数が超えると改行
      marginTop: '3%',
    },
    item: {
      alignItems: 'center',
    },
    settingitem: {
      alignItems: 'center',
      width: '25%',
      height: '52%',
    },
    label: {
      fontSize: 12,
      marginTop: 8,
    },
    box1: {
      width: '49 %',
      height: '100%',
      backgroundColor: '#00FF00',
      borderRadius: 10,
    },
    box2: {
      width: '48%',
      height: '100%',
      backgroundColor: '#6A5ACD',
      borderRadius: 10,
    },
    post: {
      // 100%の大きさ
      width: '90%',
      height: 40,
      backgroundColor: '#dcdcdc',
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalcontent: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 20,
      alignItems: 'center',
    },
    modaltext: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalbutton: {
      flexDirection: 'row',
    },
    modalbutton1: {
      backgroundColor: 'gray',
      borderRadius: 5,
      padding: 10,
    },
    modalbutton2: {
      backgroundColor: 'green',
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
    },
    modalbuttontext: {
      color: 'white',
      fontWeight: 'bold',
    },
    picker: {
      height: 50,
      width: '100%',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    input: {
      height: 50,
      width: 300,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    statusMessage: {
      color: 'gray',
      marginBottom: 5,
      marginTop: 5,
    },
    availability: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    availabilityIcon: {
      marginRight: 5,
    },
    availabilityText: {
      marginLeft: 5,
    },
  });  
  
  export default styles;