import React, { Component, useState } from "react";
import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { Avatar } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
  Container, Header, Title, Content, Footer,
  FooterTab, Left, Right, Body, Icon, Card, CardItem
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
  StatusBar, View, Alert, TouchableOpacity, ListView,
  FlatList, StyleSheet, Text, Platform, Dimensions, SafeAreaView, Animated
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import Button from '@ant-design/react-native/lib/button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEmail, updatePassword, login, getUser, getAllPersonalRecords, getMedicines } from '../Reducers/FriendActions_Custom';
import Firebase from '../database/firebase_config';
import { setCustomText } from 'react-native-global-props';

let ref = Firebase.database().ref("/user_data");

class HomeScreen extends Component {

  monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  constructor(props) {
    super(props);
    this.state = {
      doneLoadingData: false,
      latitude: null,
      longitude: null,
      datum: [],
      location: null,
      coordAvailable: false,
      placename: '',
      building: "Home",
      fontLoaded: false,
      region: {},
      intervalIsSet: true,
      othersInfo: {},
      userName: "",
      scrollPos: new Animated.Value(0)
    };
  };


  componentDidMount = () => {
    this.setState({ userName: this.props.user.nickname });
    this.props.getAllPersonalRecords(this.props.user.email);
    this.props.getMedicines(this.props.user.nickname);
    console.log("user")
    console.log(this.props.user.records)
    console.log("MEDICINES!!")
    console.log(this.props.user.medicines)
    this.findCurrentLocationAsync();
    this.defaultFonts()
    this.setState({ doneLoadingData: true });
  };

  defaultFonts() {
    const customTextProps = {
      style: {
        fontFamily: 'MuseoSemiBold'
      }
    }
    setCustomText(customTextProps);
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  };

  //Getting the GPS info from here:
  getCoordinates = (aCoord) => {
    proj4.defs(
      "EPSG:3414",
      "+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs"
    );
    let coord = proj4("EPSG:3414").inverse({
      x: parseFloat(aCoord.x),
      y: parseFloat(aCoord.y)
    });
    let toReturn = {
      x: coord.y,
      y: coord.x
    };
    return toReturn;
  };

  findCurrentLocationOfOther = (userId) => {
    Firebase.database().ref("/user_data/" + userId).on('value', (snapshot) => {
      this.setState({ othersInfo: JSON.stringify(snapshot) })
    });
  }

  findCurrentLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });
    this.setState({
      longitude: this.state.location.coords.longitude,
      latitude: this.state.location.coords.latitude
    });
    this.setState({
      region: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      }
    });
    this.setState({ coordAvailable: true });

    let apikey = 'ec29ab93c4824422a45fa69b26950762';
    let urlToFetch = 'https://api.opencagedata.com/geocode/v1/json?q=+'
      + this.state.latitude
      + '%2C+'
      + this.state.longitude
      + '&key=' + apikey;

    axios
      .get(urlToFetch)
      .then(response => {
        this.setState({ placename: response.data.results[0].formatted });
        this.setState({ building: response.data.results[0].components.suburb })
      })
      .catch(function (error) {
        console.warn(error);
      });

    this.updateCoordToDatabase(this.state.userName);
  };

  updateCoordToDatabase = (id_toupdate) => {
    ref.orderByChild("id").equalTo(id_toupdate).on("child_added", (snapshot) => {
      if (snapshot.val() === null) {
      } else {
        snapshot.ref.update({
          latitude: this.state.latitude,
          longitude: this.state.longitude
        });
      }
    });
  };

  calculateShadowOpactity = () => {
    if (this.state.scrollPos <= 12.0) {
      return ((this.state.scrollPos / 2) / 10);
    } else {
      return (0.6);
    }
  }


  render() {
    let dataGrid = [
      [{
        stackName: 'Activities',
        navigation: 'Activity',
        icon: 'md-done-all',
        backgroundColor: "#ffdfac",
        fontColor: "#ad5c0b"
      },
      {
        stackName: 'Where Am I?',
        navigation: 'pushTest',
        icon: 'md-compass',
        backgroundColor: "#91c3de",
        fontColor: "#007aa3"
      }],
      [{
        stackName: 'Medicine',
        navigation: 'Medicine',
        icon: 'md-medical',
        backgroundColor: "#98ccc0",
        fontColor: "#388477"
      },
      {
        stackName: 'Add Record',
        navigation: 'ActivityAdd',
        icon: 'md-checkmark-circle-outline',
        backgroundColor: "#ff818c",
        fontColor: "#a42b22"
      }],
      [{
        stackName: 'Diary',
        navigation: 'MedicalDiary',
        icon: 'md-list',
        backgroundColor: "#b8cf77",
        fontColor: "#558307"
      },
      {
        stackName: 'Emergency',
        navigation: 'Activity',
        icon: 'md-warning',
        backgroundColor: "#ebb4cb",
        fontColor: "#865a73"
      }]
    ]
    let text = '';
    let toShow = [];
    let marker = {};
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      marker.latlng = {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      };
    };

    let opacity = this.state.scrollPos.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 20],
      extrapolate: 'clamp',
    });

    // if (this.state.coordAvailable == false) {
    //   console.log("Coordonnates not loaded! :(");
    //   return <AppLoading />;
    // } else {

    if (this.state.doneLoadingData != true) {
      return (<Text>Loading</Text>)
    } else {
      return (
        <View style={styles.container}>

          <StatusBar barStyle="dark-content" />
          <ScrollView
            // onScroll={(event) => { this.setState({ scrollPos: new Animated.Value(event.nativeEvent.contentOffset.y) }) }}
            onScroll={(event) => { this.state.scrollPos.setValue(event.nativeEvent.contentOffset.y) }}
            style={[styles.container]}
            contentContainerStyle={styles.contentContainer}>


            <View style={{
              flexDirection: 'row',
              marginTop: getStatusBarHeight() + 20,
              marginBottom: 20
            }}>
              <View style={{
                aspectRatio: 1,
                height: 90,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.1)'
              }}>
                <Text>Today</Text>

                <Text
                  style={{ fontFamily: 'MuseoBold', fontSize: 30, fontWeight: '400' }}
                >{JSON.stringify(new Date().getDate())}</Text>
                <Text style={{ fontFamily: 'MuseoBold', fontWeight: '400' }}>{(this.monthList[new Date().getMonth()])}</Text>
              </View>

              <View style={{
                width: '100%',
                marginLeft: 12,
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 25 }}>Hello,</Text>
                <Text style={{
                  fontSize: 25,
                  fontWeight: '400',
                  fontFamily: 'MuseoBold'
                }}>{this.props.user.nickname}</Text>
              </View>
            </View>

            {dataGrid.map((element, key) => {
              return (
                <View key={key} style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  {element.map((sub_element, sub_key) => {
                    return (
                      <Card transparent key={sub_key} style={[{
                        borderWidth: 0,
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                        width: '48%'
                      }]}>
                        <CardItem style={{
                          borderRadius: 12,
                          aspectRatio: 1,
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-end',
                          backgroundColor: sub_element.backgroundColor
                        }}>
                          <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => { this.props.navigation.navigate(sub_element.navigation) }}
                          >
                            <Ionicons name={sub_element.icon} size={56} color={sub_element.fontColor} />
                            <Text style={{ color: sub_element.fontColor, fontSize: 20 }}>
                              {sub_element.stackName}
                            </Text>
                          </TouchableOpacity>
                        </CardItem>
                      </Card>
                    )
                  })}
                  {/* <View style={{ height: 2000 }}></View> */}
                </View>
              )
            })}




            {/* <MapView
                style={styles.map_view}
                region={this.state.region}
              >
                <Marker coordinate={marker.latlng} title={"You're here."}
                  description={this.state.placename}>
                </Marker>
              </MapView>
  
              <Text>Longitude: {this.state.longitude}</Text>
              <Text>Latitude: {this.state.latitude}</Text>
              <Text>Location: {this.state.placename}</Text>
              <Button type="primary" onPress={this.findCurrentLocationAsync}>Where Am I?</Button> */}

          </ScrollView>
        </View>
      );
    }

  }
  // }
}

HomeScreen.navigationOptions = {
  title: 'Dashboard / Home Page',
  header: null,
  // headerStyle: {
  //   backgroundColor: '#f4511e',
  //   fontWeight: '700'
  // },
};

const styles = StyleSheet.create({
  shadowNavbar: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 11.14,
    elevation: 17
  },
  statusBar: {
    backgroundColor: "#C2185B",
    height: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  map_view: {
    flex: 1,
    height: Dimensions.get('window').width / 2,
    borderRadius: 10
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 10
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateEmail, updatePassword, login, getUser, getAllPersonalRecords, getMedicines }, dispatch)
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)