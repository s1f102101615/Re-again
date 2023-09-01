import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import profileMain from './ProfileScreen/profileMain';
import lateAppo from './ProfileScreen/lateAppo';
import LoginScreen from '../LoginScreen';
import setting from './ProfileScreen/setting';
import { Text } from 'react-native'; // Textコンポーネントをインポート
import { auth } from '../firebase';
import { useCallback } from 'react';


const Stack = createStackNavigator();



function ProfileScreen() {
  const navigation = useNavigation();
  const handleLogout = useCallback(() => {
    auth.signOut()
      .then(() => {
        navigation.navigate('Login' as never);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [navigation]);
  
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="プロフィール">
        <Stack.Screen
          name="プロフィール"
          component={profileMain}
          initialParams={{ handleLogout }} 
        />
        <Stack.Screen name="過去の約束" component={lateAppo} />
        <Stack.Screen name="setting" component={setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default ProfileScreen;