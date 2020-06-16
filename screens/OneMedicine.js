
import React, { Component, useState } from "react";
import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import {
    Container, Header, Title, Content, Footer, Button,
    FooterTab, Left, Right, Body, Icon, Card, CardItem
} from 'native-base';
import {
    StatusBar, View, Alert, TouchableOpacity, ListView,
    FlatList, StyleSheet, Text, Platform, Dimensions, Image
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import Firebase from '../database/firebase_config';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as dbconsts from '../database/firebase_config';

let ref = Firebase.database().ref("/user_data");

export default class OneMedicine extends Component {
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
            userName: "",
            sampleList: [],
            medicineElement: {},
            currentTimer: new Date(),
            timeString: "",
            timeToChangeString: "Unchanged",
        };
    };

    componentDidMount = () => {
        let medicineElement = {
            icon: this.props.navigation.getParam('icon'),
            name: this.props.navigation.state.params.element.name,
            amount: this.props.navigation.state.params.element.amount,
            unit: this.props.navigation.state.params.element.unit,
            time: this.props.navigation.state.params.element.time,
            nickname: this.props.navigation.state.params.element.nickname,
        }

        this.setState({ medicineElement: medicineElement })
        let date = new Date(parseInt(medicineElement.time))
        this.setState({ currentTimer: date })
        let timeMode = "AM"
        let newHour = date.getHours()
        let newMinutes = date.getMinutes()

        if (newHour >= 12) {
            timeMode = "PM"
        }
        if (newMinutes <= 9) {
            newMinutes = "0" + newMinutes
        }
        let newTime = newHour + ":" + newMinutes + " " + timeMode
        this.setState({ timeString: newTime })
        this.setState({ username: medicineElement.nickname })
    }

    handleOnChange = (event, date) => {
        let timeMode = "AM"
        let newHour = date.getHours()
        let newMinutes = date.getMinutes()

        if (newHour >= 12) {
            timeMode = "PM"
        }
        if (newMinutes <= 9) {
            newMinutes = "0" + newMinutes
        }
        let newTimeString = newHour + ":" + newMinutes + " " + timeMode
        this.setState({ timeToChangeString: newTimeString })
        this.setState({ currentTimer: date })
    }

    buttonClicked = () => {
        let data = {
            name: this.state.medicineElement.name,
            amount: this.state.medicineElement.amount,
            unit: this.state.medicineElement.amount,
            time: this.state.currentTimer.getTime(),
            nickname: this.state.medicineElement.nickname
        }
        let newMedicine = "" + data.nickname + "_" + data.time
        dbconsts.db.collection('medicines').doc(newMedicine).set(data)
        console.log("" + data.nickname + "_" + this.props.navigation.state.params.element.time)
        let originalMedicine = "" + data.nickname + "_" + this.props.navigation.state.params.element.time
        dbconsts.db.collection('medicines').doc(originalMedicine).delete();
        this.props.navigation.navigate('Medicine')
    }

    render() {
        const screenHeight = Math.round(Dimensions.get('window').height)
        let { medicineElement } = this.state;
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
        let cardHeight = 85;

        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        return (
            <Container>
                <StatusBar barStyle="dark-content" />

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>


                    <View style={{
                        flexDirection: 'row',
                        padding: 10,
                        marginBottom: 12, marginTop: 12, borderRadius: 12,
                        height: screenHeight * 0.1,
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.03)'
                    }}>
                        <Image style={{
                            marginRight: 10,
                            height: ((cardHeight - 1) / cardHeight) * 100,
                            width: ((cardHeight - 1) / cardHeight) * 100
                        }}
                            source={require('../assets/icons/pills.png')} />
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{
                                height: '100%',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly'
                            }}>
                                <Text style={{
                                    fontFamily: 'MuseoBold',
                                    fontWeight: '400', fontSize: 16
                                }}>{capitalize(medicineElement.name)}</Text>
                                <Text>
                                    {medicineElement.amount} {medicineElement.unit}(s)
                                </Text>
                            </View>
                            <Text style={{ fontSize: 18 }}>{this.state.timeString}</Text>
                        </View>
                    </View>

                    <View style={{
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        flexDirection: 'column',
                        padding: 10,
                        marginBottom: 12, marginTop: 12, borderRadius: 12,
                        height: screenHeight * 0.4,
                        justifyContent: "center"
                    }}>
                        <Text style={{
                            alignSelf: "center",
                            fontSize: 18,
                            backgroundColor: "white",
                            paddingHorizontal: 10,
                            paddingBottom: 30
                        }}>
                            Set the time.
                        </Text>
                        <RNDateTimePicker
                            mode="time"
                            onChange={this.handleOnChange}
                            value={this.state.currentTimer}
                        />
                        <Text style={{
                            alignSelf: "center",
                            paddingTop: 30,
                            fontSize: 18,
                            backgroundColor: "white",
                            paddingHorizontal: 10,
                        }}> Current time : {this.state.timeString} </Text>
                    </View>
                    <View style={{
                        marginVertical: 20,
                        alignItems: "center"
                    }}>
                        <Text style={{
                            fontSize: 18,
                        }}>
                            New Time : {this.state.timeToChangeString}
                        </Text>

                    </View>

                    <TouchableOpacity
                        style={{
                            padding: 10,
                            marginBottom: 12, marginTop: 12, borderRadius: 12,
                            height: screenHeight * 0.1,
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            justifyContent: "center",
                        }}
                        onPress={this.buttonClicked}>
                        <Text style={{ fontSize: 20, }}>
                            Set New Time
                                </Text>
                    </TouchableOpacity>

                </ScrollView>

            </Container >
        );
    }
    // }
}

OneMedicine.navigationOptions = {
    headerStyle: {
        shadowColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
    },
    headerTitleStyle: {
        fontFamily: 'MuseoBold',
        fontWeight: "200"
    },
    title: 'Schedule Edit',
};

const styles = StyleSheet.create({
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
        padding: 12
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
