import React from 'react';
import TalkRoom from './TalkScreen/TalkRoom';
import { createStackNavigator } from '@react-navigation/stack';
import TalkList from './TalkScreen/TalkList';
import TalkRoomMenu from './TalkScreen/TalkRoomMenu';

const Stack = createStackNavigator();

const TalkScreen = () => {

  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="List" options={{ title: 'トーク' }} component={TalkList} />
      <Stack.Screen name="Talk" options={{ title: 'ルーム' }} component={TalkRoom}  />
      <Stack.Screen name='TalkRoomMenu' options={{ title: 'トーク設定'}} component={TalkRoomMenu} />
    </Stack.Navigator>
  );
};

export default TalkScreen;