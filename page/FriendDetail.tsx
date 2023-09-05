import { Modal, Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type FriendModalProps = {
  selectedFriend: { id: string, friend: string, photoURL?: string, status?:string, message?:string } | null;
  onClose: () => void;
};

function FriendModal({ selectedFriend, onClose }: FriendModalProps) {
  return (
    <Modal visible={selectedFriend !== null} animationType="slide">
      <View style={styles.container}>
        {selectedFriend?.photoURL ? (
          <Image source={{ uri: selectedFriend?.photoURL }} style={styles.image}/>
        ) : (
          <Ionicons name="person-circle-outline" size={100} color={'gray'} style={styles.image} />
        )}
        <Text style={styles.title}>{selectedFriend?.friend}</Text>
        <Text style={styles.statusMessage}>{selectedFriend?.message === null ? selectedFriend?.message : '未設定'}</Text>
        

        <View style={styles.availability}>
            {/* statusの忙しさによって色を変えたい */}
            <Ionicons name='time-outline' size={20} color={selectedFriend?.status === 'ぜんぜん' ? 'green' : selectedFriend?.status === 'ちょっと' ? '#b8d200' :
          selectedFriend?.status === 'ふつう' ? 'yellow' : selectedFriend?.status === 'まあまあ' ? 'orange' : selectedFriend?.status === 'とても' && 'red' } style={styles.availabilityIcon} />
            <Text style={styles.availabilityText}>{selectedFriend?.status === null ? selectedFriend?.status : '未設定'}</Text>
          </View>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>閉じる</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 100,
      marginBottom: 20,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 10,
    },
    statusMessage: {
      color: 'gray',
      marginBottom: 10,
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
    closeButton: {
      marginTop: 20,
    },
    closeButtonText: {
      color: 'blue',
    },
  });

export default FriendModal;