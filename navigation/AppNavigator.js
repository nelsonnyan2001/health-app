import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import MainTabNavigator from './MainTabNavigator';
import Authentication from '../screens/AuthenticationScreen';

import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Profile from '../screens/Profile';
import ActivityScreen from '../screens/ActivityScreen';
import push_test from '../screens/push_test';

// export default createAppContainer(
//   createSwitchNavigator({
//     Authentication: Authentication,
//     Main: MainTabNavigator,
//   })
// );

export default createAppContainer(
  // createStackNavigator(
  createSwitchNavigator(
    {
      Login: {
        screen: Login
      },
      Signup: {
        screen: Signup
      },
      Profile: {
        screen: Profile
      },

      Main: {
        screen: MainTabNavigator //This is the main content of our app
      },
      pushTest: {
        screen: push_test
      },
    },
    {
      initialRouteName: 'Login'
    }
  )
);
