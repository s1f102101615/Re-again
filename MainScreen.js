// MainScreen.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './page/HomeScreen';
import ProfileScreen from './page/ProfileScreen';
import ApoScreen from './page/ApoScreen';
import FriendScreen from './page/FriendScreen';
import TalkScreen from './page/TalkScreen';

const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);
  return (
    <Tab.Navigator>
      <Tab.Screen name="ホーム" component={HomeScreen} />
      <Tab.Screen name="トーク" component={TalkScreen} />
      <Tab.Screen name="約束" component={ApoScreen} />
      <Tab.Screen name="フレンド" component={FriendScreen} />
      <Tab.Screen name="プロフィール" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
