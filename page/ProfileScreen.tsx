import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import profileMain from './ProfileScreen/profileMain';
import lateAppo from './ProfileScreen/lateAppo';
import LoginScreen from '../LoginScreen';
import setting from './ProfileScreen/setting';


const Stack = createStackNavigator();

function ProfileScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="プロフィール" >
        <Stack.Screen name="プロフィール" component={profileMain} />
        <Stack.Screen name="過去の約束" component={lateAppo} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="setting" component={setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default ProfileScreen;