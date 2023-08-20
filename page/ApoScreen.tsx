import { createStackNavigator } from '@react-navigation/stack';
import TalkRoom from './TalkScreen/TalkRoom';
import ApoScreenMain from './ApoScreenMain';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

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