// MainScreen.js
import React from 'react';
import { StyleSheet, route } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './page/HomeScreen';
import ProfileScreen from './page/ProfileScreen';
import ApoScreen from './page/ApoScreen';
import FriendScreen from './page/FriendScreen';
import TalkScreen from './page/TalkScreen';
import { Ionicons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);
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
    },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default MainScreen;
