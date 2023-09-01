// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import RegisterScreen from './RegisterScreen';
import SetnameScreen from './SetnameScreen';
const Stack = createStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" options={{ title: 'ログイン' }} component={LoginScreen} />
        <Stack.Screen name="Register" options={{ title: '新規登録' }} component={RegisterScreen}  />
        <Stack.Screen options={{ gestureEnabled:false, title: 'ユーザーネーム設定' }} name="Setname" component={SetnameScreen}  />
        <Stack.Screen options={{ gestureEnabled:false, headerShown:false }} name="Main" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
