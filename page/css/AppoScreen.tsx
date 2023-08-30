import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      height: 'auto',
    },
    closeButton: {
      borderRadius: 5,
      padding: 10,
    },
    closeButtonX:{
      paddingTop:10,
      paddingRight:20,
    },
    closeButtonText: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
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
    circleContainerd: {
      position: 'absolute',
      bottom: '34%',
      right: 20,
      zIndex: 2,
    },
    centeredView: {
      flex: 1,
    },
    centeredViewNewApo: {
      flex: 1,
      backgroundColor: '#000000aa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: '#fff',
      marginTop: '100%',
      borderRadius: 5,
      width: '100%',
      height: '125%',
      padding: 0,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 5,
      justifyContent: 'flex-start',
    },
    modalViewNewApo: {
      backgroundColor: '#fff',
      borderRadius: 5,
      width: '90%',
      height: '70%',
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
    input1: {
      borderWidth: 1,
      padding: 15,
      width: '90%',
      marginLeft: '5%',
      textAlign: 'left',
    },
    input2: {
      borderWidth: 1,
      padding: 15,
      width: '90%',
      height: '30%',
      marginLeft: '5%',
      textAlign: 'left',
      marginTop: '7%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      marginLeft: 3,
    },
    content: {
      fontSize: 16,
    },
    contentLeft: {
      fontSize: 16,
      
    },
    contenttime: {
      fontSize: 16,
      height: '100%',
      width: '27%',
      textAlign: 'center',
      paddingTop: '7%',
    
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
    scrollContainer: {
      flexGrow: 1,
      height: 'auto',
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    calendarline: {
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: 27,
      backgroundColor: '#585858',
    },
    modalText: {
      marginBottom: 10,
    },
    searchBox: {
      width: '100%',
      height: 40,
      padding: 8,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 10,
      marginLeft: 5,
      borderRadius: 5,
    },
    highlight: {
      backgroundColor: 'yellow',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    modalHeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginRight: '26%',
      marginTop: '2%',
    },
    likeedit: {
      flexDirection: 'row', // 要素を横に並べる
      justifyContent: 'space-between', // 要素間のスペースを均等に分配
      paddingHorizontal: '12%', // 左右のパディング
      alignItems: 'center', // 縦方向に中央揃え
      marginTop: '3%',
      marginRight: '4%',
    },
    item: {
      alignItems: 'center',
    },
    label: {
      fontSize: 12,
      marginTop: 8,
    },
    lightLine: {
      height: 1,
      backgroundColor: '#000000',
      opacity: 0.2,
      marginTop: '2%',
    },
    lightLine2: {
      height: 1,
      backgroundColor: '#000000',
      opacity: 0.2,
      marginTop: '35%',
    },
    headtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: '5%',
      marginLeft: '5%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    friendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    friendName: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    inviteButton: {
      backgroundColor: 'blue',
      borderRadius: 10,
      padding: 10,
      marginTop: 20,
    },
    inviteButtonText: {
      color: 'white',
      fontSize: 16,
    },
    talkroomRef: {
      width: '100%',
      marginTop: '3%',
    },
    ibar: {
      width: '2%',
      height: '100%',
      backgroundColor: '#f13434',
      opacity: 0.2,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
      alignContent: 'flex-start',
      width: '100%',
    },
    searchIconContainer: {
      padding: 10,
      marginLeft: 10,
    },
    ApoIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
      alignContent: 'flex-start',
      width: '100%',
      left: '76%',
    },
    searchBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      alignContent: 'flex-start',
      width: '80%',
    },
    closeIconContainer: {
      position: 'absolute',
      top: -3,
      right: -5,
      padding: 10,
    },
    
  });

  export default styles;