import React, { Component } from "react";
import { View, StyleSheet, Button, Alert, Platform } from "react-native";
import { Constants, Notifications } from "expo";
import * as Permissions from "expo-permissions";

import { Container, Header, Content, Form, Item, Input } from "native-base";

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

export default class Notifier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notiText: '',
      intervalIsSet: false,
      timeInterval: 0
    };
  }

  componentDidMount = () => {
    if (this.state.intervalIsSet == false) {
    } else {
      let interval = setInterval(() => {
        this._handleButtonPress();
        console.log(this.state.timeInterval);
        console.log(this.state.intervalIsSet);
      }, this.state.timeInterval);
      this.setState({ intervalIsSet: interval });
    }
  };

  _handleButtonPress = async () => {
    // console.log(this.state.intervalIsSet);
    // console.log(this.state.timeInterval);

    await Notifications.presentLocalNotificationAsync({
      title: "Health App Notification",
      body: 'Hung'
    });
  };

  listenForNotifications = () => {
    Notifications.addListener(notification => {
      if (notification.origin === "received" && Platform.OS === "ios") {
        Alert.alert("Notification", 'Hung');
      }
    });
  };

  componentWillMount() {
    getiOSNotificationPermission();
    this.listenForNotifications();
  }
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <Form>
            <Item>
              <Input
                placeholder="Set Interval Time (in seconds), number only please."
                onChangeText={text => {
                  // this.setState({ notiText: 'This is the notification by ' + text + 'second(s).' });
                  this.setState({ intervalIsSet: true });
                  this.setState({ timeInterval: parseInt(text) * 1000 });
                }}
              />
            </Item>
          </Form>

          <Button
            title="Send a notification"
            onPress={this.componentDidMount}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    backgroundColor: "#ecf0f1"
  }
});
