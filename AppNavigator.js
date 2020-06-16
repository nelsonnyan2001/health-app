import { createStackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import AuthenticationScreen from './screens/AuthenticationScreen';

const AppNavigator = createStackNavigator({
  Authentication: { screen: AuthenticationScreen },
  Home: { screen: HomeScreen },
});

export default AppNavigator;
