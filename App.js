import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';

import { Provider } from 'react-redux';
import store from './store';

import { setCustomText } from 'react-native-global-props';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [signedIn, checkedSignIn] = useState(false);
  console.disableYellowBox = true;

  function defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: 'Museo'
      }
    }
    setCustomText(customTextProps);
  }

  async function loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        Museo: require('./fonts/museosanscyrl-300.ttf'),
        MuseoBold: require('./fonts/museosanscyrl-700.ttf'),
        MuseoSemiBold: require('./fonts/museosanscyrl-500.ttf'),
        //Below are the default font of Android, don't delete them:
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        ...Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
    defaultFonts();
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <Provider store={store} >
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => handleFinishLoading(setLoadingComplete)}
        />
      </Provider>
    );
  } else {
    return (
      <Provider store={store} >
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}



function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});