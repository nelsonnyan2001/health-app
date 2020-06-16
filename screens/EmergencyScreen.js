
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
    StatusBar, View, Text, Alert, TouchableOpacity, ListView,
    FlatList, StyleSheet, Platform, Dimensions
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import { setCustomText } from 'react-native-global-props';

import Firebase from '../database/firebase_config';

let ref = Firebase.database().ref("/user_data");


export default class EmergencyScreeen extends Component {
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
            userName: ""
        };
    };

    componentWillMount = () => {
        // this.setState({ userName: this.props.navigation.state.params.username });
        this.setState({ userName: 'person1' });
    };

    componentDidMount = () => {
        this.defaultFonts();
    };

    defaultFonts() {
        const customTextProps = {
            style: {
                fontFamily: 'MuseoSemiBold'
            }
        }
        setCustomText(customTextProps);
    }

    render() {

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
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                >
                    <View style={{ paddingTop: 50 }}>
                        <Card style={{
                            borderRadius: 20,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 6,
                            },
                            shadowOpacity: 0.2,
                            shadowRadius: 8.30,
                            elevation: 13,
                        }}>
                            <View style={{
                                top: -45,
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Avatar
                                    rounded
                                    size="large"
                                    source={{
                                        uri:
                                            'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                                    }}
                                />
                            </View>

                            <View style={{
                                height: 80,
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <Text style={{ fontSize: 20 }}>Hung Nguyen</Text>
                                <Text style={{ color: 'black', opacity: 0.7 }}>+65 7889 9000</Text>
                            </View>
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly'
                            }}>
                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text>Relationship</Text>
                                    <Text style={{ fontFamily: 'MuseoBold' }}>Brother</Text>
                                </View>

                                <View
                                    style={{
                                        height: 50,
                                        width: 2,
                                        borderColor: 'black',
                                        opacity: 0.1,
                                        borderLeftWidth: 1,
                                        borderLeftColor: 'white',
                                    }}
                                />
                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text>Gender</Text>
                                    <Text style={{ fontFamily: 'MuseoBold' }}>Male</Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                                justifyContent: 'space-evenly',
                                height: 100
                            }}>

                                <View style={styles.circle}>
                                    <Ionicons name="ios-call" size={32} />
                                </View>
                                <View style={styles.circle}>
                                    <Ionicons name="ios-send" size={32} />
                                </View>

                            </View>

                        </Card>
                    </View>

                    <View style={{
                        height: 40,
                        backgroundColor: 'beige',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly'
                    }}>
                        <Text>Address</Text>
                        <Text style={{ fontFamily: 'MuseoBold' }}>149 Sims Drive</Text>
                    </View>

                </ScrollView>
            </View >
        );

    }
}

EmergencyScreeen.navigationOptions = {
    headerStyle: {
        shadowColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
    },
    headerTitleStyle: {
        fontFamily: 'MuseoBold',
        fontWeight: "200"
    },
    headerShown: true,
    title: 'Contact Details',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingTop: 0,
        padding: 15
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
    circle: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#ebeff2',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
