// MainScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet , View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './page/HomeScreen';
import ProfileScreen from './page/ProfileScreen';
import ApoScreen from './page/ApoScreen';
import FriendScreen from './page/FriendScreen';
import TalkScreen from './page/TalkScreen';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from './firebase';
import { doc, deleteDoc, collection, addDoc, getDocs, query, where, onSnapshot, collectionGroup } from 'firebase/firestore';
const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  useEffect(() => {
    // フレンド申請を受け取る処理 
    const user = auth.currentUser;
    const q = query(collection(firestore, `users/${user.uid}/gotRequests`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({ ...doc.data(), id: doc.id });
      });
      setFriendRequests(requests); // 新しい配列を作成して、それをfriendRequestsに設定する
    });
    return () => unsubscribe();
  }, []);

  return (
    <Tab.Navigator
      //tabに影を追加する
      screenOptions={({ route }) => ({
        tabBarStyle: {
          ...styles.shadow,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ホーム') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'トーク') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === '約束') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'フレンド') {
            iconName = focused ? 'people' : 'people-outline';
            if (friendRequests.length > 0) {
              return (
                <View>
                  <Ionicons name={iconName} size={size} color={'black'} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{friendRequests.length}</Text>
                  </View>
                </View>
              );
            }
          } else if (route.name === 'プロフィール') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={'black'} />;
        },
        tabBarActiveIcon: ({ color, size }) => (
          <Ionicons name="star" size={size} color={color} />
        ),
        tabBarActiveTintColor: '#000000',
      })}
    >
      <Tab.Screen
        name="ホーム"
        component={HomeScreen}
      />
      <Tab.Screen
        name="トーク"
        component={TalkScreen}
      />
      <Tab.Screen
        name="約束"
        component={ApoScreen}
      />
      <Tab.Screen
        name="フレンド"
        component={FriendScreen}
      />
      <Tab.Screen
        name="プロフィール"
        component={ProfileScreen}
      />
    </Tab.Navigator>
    
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      height: -3,
      width: 0
    },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -9,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MainScreen;
