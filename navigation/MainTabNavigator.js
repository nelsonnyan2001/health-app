import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ContactScreen from "../screens/ContactScreen";
import Notifier from "../screens/NotificationScreen.js";
import Profile from "../screens/Profile.js";
import ActivityScreen from '../screens/ActivityScreen';
import MedicalDiary from '../screens/MedicalDiary';
import EmergencyScreen from '../screens/EmergencyScreen';
import MedicineDoseScreen from '../screens/MedicineDose';
// import FirebaseNotificationHub from '../screens/FirebaseNotificationScreen';
import SimpleNotification from '../screens/SimpleNotification';
import OneMedicine from "../screens/OneMedicine";
import ActivityAdding from "../screens/ActivityAdding";
import push_test from '../screens/push_test'

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

//Setting for Home Screen:
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Activity: ActivityScreen,
    ActivityAdd: ActivityAdding,
    MedicalDiary: MedicalDiary,
    Medicine: MedicineDoseScreen,
    OneMedicine: OneMedicine,
    pushTest: push_test,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

HomeStack.path = "";

//Setting for Link Screen:
const LinksStack = createStackNavigator(
  {
    Links: LinksScreen
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

LinksStack.path = "";

//Setting for Profile Screen:
const ProfileStack = createStackNavigator(
  {
    Profile: Profile,
    Emergency: EmergencyScreen
  },
  config
);

ProfileStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

ProfileStack.path = "";

//Setting for Setting Screen:
const SettingsStack = createStackNavigator(
  {
    // Settings: SettingsScreen
    Settings: Notifier
    // Settings: SimpleNotification
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Notifications",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

SettingsStack.path = "";

//Setting for Call Screen:
const ContactStack = createStackNavigator(
  {
    Contacts: ContactScreen
  },
  config
);

ContactStack.navigationOptions = {
  tabBarLabel: "Contacts",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-contact" : "md-contact"}
    />
  )
};

ContactStack.path = "";

// //Setting for Notification Screen:
// const NotificationStack = createStackNavigator(
//   {
//     Notifications: Notifier
//   },
//   config
// );

// ContactStack.navigationOptions = {
//   tabBarLabel: "Contacts",
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === "ios" ? "ios-contact" : "md-contact"}
//     />
//   )
// };

// ContactStack.path = "";

//=========================================================================================

//Set the view to Tab Navigator:
const tabNavigator = createBottomTabNavigator({
  HomeStack,

  // LinksStack,
  ProfileStack,
  SettingsStack,
  // ContactStack
});

tabNavigator.path = "";

export default tabNavigator;
