
import React, { Component } from "react";
import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import {
    Container, Header, Title, Content, Footer, Button,
    FooterTab, Left, Right, Body, Icon, Card, CardItem, Tab, Tabs
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
    StatusBar, View, Alert, TouchableOpacity, ListView,
    FlatList, StyleSheet, Text, Platform, Dimensions
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';

import Firebase from '../database/firebase_config';

let ref = Firebase.database().ref("/user_data");


export default class MedicalDiary extends Component {
    constructor(props) {
        super(props);
        this.scroller = null;
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
            optionToggled: false
        };
    };

    componentWillMount = () => {
        this.setState({ userName: 'zwenyantoe' });
    };

    formatDate = (date) => {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    };

    options = [
        {
            icon: 'md-checkbox-outline',
            action: 'Enter'
        }, {
            icon: 'md-copy',
            action: 'Report'
        }, {
            icon: 'md-mail-open',
            action: 'Email'
        }
    ]

    render() {

        let dataGrid = [{
            icon: 'md-speedometer',
            label: "Weight",
            value: "56",
            unit: "kg"
        },
        {
            icon: 'md-pulse',
            label: "Pulse",
            value: "233",
            unit: "per second"
        }, {
            icon: 'md-heart-empty',
            label: "Blood Pressure",
            value: "67",
            unit: "unknown"
        }
        ];

        let marker = {};
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location) {
            text = JSON.stringify(this.state.location);
            marker.latlng = {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            };
        }

        const cardWidth = '32.5%';
        return (
            <Container style={{
                backgroundColor: "#ebebf0",
                paddingTop: 80
            }}>
                <StatusBar
                    backgroundColor="#ebebf0"
                    translucent barStyle="dark-content" />

                <ScrollView
                    style={styles.container}
                // contentContainerStyle={styles.contentContainer}
                >
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        padding: 12,
                    }}>
                        <Text style={{
                            fontSize: 30,
                            fontFamily: 'MuseoBold', fontWeight: '400',
                            // marginBottom: 20
                        }}>
                            Medical Summary
                    </Text>
                        <TouchableOpacity onPress={() => {
                            this.setState({ optionToggled: !this.state.optionToggled })
                        }}>
                            <Ionicons style={{ marginRight: 10 }} name='md-list' size={32} color={"#e73100"} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        ref={(ref) => this.scroller = ref}
                        horizontal={true}
                    >
                        {this.state.optionToggled && this.options.map((sub_element, sub_key) => {
                            return (
                                <TouchableOpacity key={sub_key}
                                    style={{
                                        paddingLeft: (sub_key == 0 ? 12 : 4), paddingRight: 0
                                    }}>
                                    <Card style={[{
                                        borderWidth: 0,
                                        borderColor: 'transparent',
                                        backgroundColor: "#e73100",
                                        borderRadius: 12,
                                    }]}>
                                        <CardItem style={{
                                            aspectRatio: 1,
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            justifyContent: 'flex-end',
                                            backgroundColor: 'transparent',
                                        }}>
                                            <View style={{ padding: 10 }}   >
                                                <Ionicons name={sub_element.icon} size={50} color={'white'} />
                                                <Text style={{ color: 'white', fontSize: 15, marginTop: 5 }}>
                                                    {sub_element.action}
                                                </Text>
                                            </View>
                                        </CardItem>
                                    </Card>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>

                    <View style={{ padding: 10 }}>
                        {dataGrid.map((element, key) => (
                            <Card key={key} style={{
                                margin: 10,
                                borderWidth: 0,
                                borderColor: 'transparent',
                                borderRadius: 12,
                            }}>
                                <CardItem style={{
                                    backgroundColor: 'transparent',
                                    width: '100%'
                                }}>
                                    <TouchableOpacity
                                        style={{ padding: 10, flex: 1 }}
                                    // onPress={() => { this.props.navigation.navigate(sub_element.navigation) }}
                                    >
                                        <View style={{
                                            marginBottom: 10,
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Ionicons style={{ marginRight: 10 }} name={element.icon} size={32} color={"#e73100"} />
                                            <Text style={{
                                                fontSize: 20,
                                                fontFamily: 'MuseoBold',
                                                fontWeight: '400',
                                                color: "#e73100"
                                            }}>{element.label}</Text>
                                        </View>

                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Text style={{
                                                fontFamily: 'MuseoBold',
                                                fontWeight: '400',
                                                fontSize: 45
                                            }}>
                                                {element.value}
                                            </Text>
                                            <Text style={{ opacity: 0.4, fontSize: 20 }}>
                                                {element.unit}
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </CardItem>
                            </Card>
                        ))}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(0, 0, 0, 0.3)' }}>Latest Update</Text>
                        <Text style={{ color: 'rgba(0, 0, 0, 0.3)' }}>{this.formatDate(new Date())}</Text>
                    </View>

                </ScrollView >
            </Container >
        );

    }
}

MedicalDiary.navigationOptions = {
    headerShown: true,
    // title: 'Medical Diary',
    headerTransparent: true,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebf0"
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
        padding: 8
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
