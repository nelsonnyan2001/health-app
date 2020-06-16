import { ExpoLinksView } from '@expo/samples';
import React, { Component } from "react";
import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
let _ = require('lodash');
import {
  Container, Header, Title, Content, Footer, Item, Label,
  FooterTab, Left, Right, Body, Icon, Card, CardItem, List, ListItem, Text, Button, Input
} from 'native-base';
import {
  StatusBar, View, Alert, TouchableOpacity, ListView,
  FlatList, StyleSheet, Platform, Dimensions
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';

import { bindActionCreators } from 'redux';
import { addFriend } from '../Reducers/FriendActions';
import { addFriendCustom } from '../Reducers/FriendActions_Custom';
import { connect } from 'react-redux';

import Firebase from '../database/firebase_config';
let ref = Firebase.database().ref("/user_data");

const mapStateToProps = (state) => {
  const { friends } = state
  return { friends }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addFriendCustom,
  }, dispatch)
);

class LinksScreen extends Component {
  friendData = [];

  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      datum: [],
      location: null,
      coordAvailable: false,
      placename: '',
      building: "Home",
      fontLoaded: false,
      region: {},
      intervalIsSet: false,
      othersInfo: {},
      friendList: ["person2", "person3", "person4", "person5", "person6", "person7", "person8"],
      friend_data: [],
      tempFriendToAdd: ''
    };
  };

  componentWillMount = () => {
    //this.fetchFriendListData();
  };

  componentDidMount = () => {
    let interval = setInterval(() => {
      //this.fetchFriendListData();
      //console.log("The friend list and friend data were changed.");
    }, 5000);
    this.setState({ intervalIsSet: interval });
  };

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  };

  fetchFriendListData = async () => {
    friendDataPromises = [];
    this.state.friendList.forEach((element) => {
      friendDataPromises.push(this.findCurrentLocationOfOther(element));
    });

    Promise.all(friendDataPromises).then(vals => {
      console.log("FINAL");
      this.setState({ friend_data: vals });
      console.log(this.state.friend_data);

    })
  }

  findCurrentLocationOfOther = (userId) => {
    return new Promise((resolve, reject) => {
      Firebase.database().ref('/user_data').orderByChild("id").equalTo(userId).on("child_added", (snapshot) => {
        resolve(snapshot.val());
      });
    })
  }

  render() {
    // console.log(this.props);
    const friends_listed = this.props.friends.current.map((aFriend) => {
      return (
        <ListItem key={aFriend.id}>
          <Body>
            <Text>{aFriend.name}</Text>
            <Text note>Longitude: {aFriend.longitude}</Text>
            <Text note>Latitude: {aFriend.latitude}</Text>
          </Body>
          <Right>
            <Text note>{aFriend.id}</Text>
          </Right>
        </ListItem>
        // <ListItem key={aFriend}>
        //   <Body>
        //     <Text>{aFriend}</Text>
        //     <Text note>Longitude: {aFriend}</Text>
        //     <Text note>Latitude: {aFriend}</Text>
        //   </Body>
        //   <Right>
        //     <Text note>{aFriend}</Text>
        //   </Right>
        // </ListItem>
      );
    });

    return (
      <ScrollView style={styles.container}>
        <Item floatingLabel>
          <Label>Username to add</Label>
          <Input
            autoCapitalize='none'
            label="Username to add"
            onChangeText={
              (value) => this.setState({ tempFriendToAdd: value })
            }
            placeholder="personN" />
        </Item>

        <Button
          style={{ marginVertical: 15 }}
          onPress={() => {
            // this.props.onAddFriendCustom(this.state.tempFriendToAdd);
            this.props.addFriendCustom(this.state.tempFriendToAdd);
            this.setState({ tempFriendToAdd: '' });
          }
          }
        >
          <Text>Add</Text>
        </Button>

        <List>
          {friends_listed}
        </List>

      </ScrollView >
    );
  }

}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LinksScreen);