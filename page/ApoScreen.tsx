import { createStackNavigator } from '@react-navigation/stack';
import TalkRoom from './TalkScreen/TalkRoom';
import ApoScreenMain from './ApoScreenMain';
import { NavigationContainer } from '@react-navigation/native';
import * as Calendar from 'expo-calendar';


const Stack = createStackNavigator();

// パーミッションを取得する処理
// const requestCalendarPermission = async () => {
//   const { status } = await Calendar.requestCalendarPermissionsAsync();
//   if (status === 'granted') {
//     const { status: remindersStatus } = await Calendar.requestRemindersPermissionsAsync();
//     if (remindersStatus === 'granted') {
//       // 許可された場合の処理
//       fetchCalendarData();
//     }
//   }
// };
//   const fetchCalendarData = async () => {
//     const calendars = await Calendar.getCalendarsAsync();
//   };
  
  
  // requestCalendarPermission();

function AppScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="約束" >
        <Stack.Screen name="約束" component={ApoScreenMain} />
        <Stack.Screen name="ルーム" component={TalkRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default AppScreen;