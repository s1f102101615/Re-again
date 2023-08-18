import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import TalkRoom from './TalkRoom';
import { createStackNavigator } from '@react-navigation/stack';
import TalkList from './TalkList';

const Stack = createStackNavigator();

const TalkScreen = () => {

  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="List" options={{ title: 'トーク' }} component={TalkList} />
      <Stack.Screen name="Talk" options={{ title: 'ルーム' }} component={TalkRoom}  />
    </Stack.Navigator>
  );
};

export default TalkScreen;