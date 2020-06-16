
import React, { Component } from "react";
import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import {
    Container, Header, Title, Content, Footer, Button,
    FooterTab, Left, Right, Body, Icon, Card, CardItem
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
    StatusBar, View, Alert, TouchableOpacity, ListView,
    FlatList, StyleSheet, Text, Platform, Dimensions, Image
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';

import Firebase from '../database/firebase_config';

let ref = Firebase.database().ref("/user_data");

class MedicineDoseScreen extends Component {
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
            // samplePercentFill: this.excerciseList[0]
        };
    };


    componentDidMount = () => {
        console.log(this.props.user.medicines)
    }



    medicalList = this.props.user.medicines

    render() {
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
        }
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }

        let cardHeight = 85;

        return (
            <Container>
                <StatusBar barStyle="dark-content" />

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>
                    <Text style={{ fontSize: 21, fontFamily: 'MuseoBold', marginVertical: 15 }}>MORNING</Text>

                    {
                        this.medicalList.map((element, key) => {
                            let date = new Date(element.time)
                            let mins = 0
                            let dateString = ""

                            if (date.getMinutes() <= 9) {
                                mins = "0" + date.getMinutes()
                            } else {
                                mins = "" + date.getMinutes()
                            }

                            if (date.getHours() <= 11) {
                                dateString = "" + (date.getHours()) + ":" + mins + " a.m"
                            }
                            else {
                                dateString = "" + (date.getHours() - 12) + ":" + mins + " p.m"
                            }

                            if (date.getHours() <= 11) {
                                // if (element.time == outerelement) {
                                return (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => {
                                            this.props.navigation.navigate('OneMedicine', { element });
                                        }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            padding: 10,
                                            marginBottom: 12, marginTop: 12, borderRadius: 12,
                                            height: cardHeight,
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.03)'
                                        }}>
                                            <Image style={{
                                                marginRight: 10,
                                                height: ((cardHeight - 1) / cardHeight) * 100,
                                                width: ((cardHeight - 1) / cardHeight) * 100
                                            }}
                                                source={require('../assets/icons/long_tablet.png')} />
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
                                                    }}>{capitalize(element.name)}</Text>
                                                    <Text>
                                                        {element.amount} item(s)
                                                </Text>
                                                </View>
                                                <Text style={{ fontSize: 18 }}>{dateString}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>)
                            }
                        })}

                    <Text style={{ fontSize: 21, fontFamily: 'MuseoBold', marginVertical: 30 }}>AFTERNOON</Text>

                    {this.medicalList.map((element, key) => {

                        let date = new Date(element.time)
                        let mins = 0
                        let dateString = ""

                        if (date.getMinutes() <= 9) {
                            mins = "0" + date.getMinutes()
                        } else {
                            mins = "" + date.getMinutes()
                        }

                        if (date.getHours() <= 11) {
                            dateString = "" + (date.getHours()) + ":" + mins + " a.m"
                        }
                        else {
                            dateString = "" + (date.getHours() - 12) + ":" + mins + " p.m"
                        }

                        if (date.getHours() > 11) {
                            return (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => {
                                        this.props.navigation.navigate('OneMedicine', { element });
                                    }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        padding: 10,
                                        marginBottom: 12, marginTop: 12, borderRadius: 12,
                                        height: cardHeight,
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
                                                }}>{capitalize(element.name)}</Text>
                                                <Text>
                                                    {element.amount} item(s)
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 18 }}>{dateString}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>)
                        }
                    })}
                </ScrollView>
            </Container >
        );
    }
    // }
}

MedicineDoseScreen.navigationOptions = {
    headerStyle: {
        shadowColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
    },
    headerTitleStyle: {
        fontFamily: 'MuseoBold',
        fontWeight: "200"
    },
    title: 'Medicine',
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



const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(MedicineDoseScreen)