import React, { Component } from "react";
import { AppLoading } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateEmail, updatePassword, login, getUser, getAllPersonalRecords } from '../Reducers/FriendActions_Custom';
import {
    Container, Header, Title, Content, Footer, Button,
    FooterTab, Left, Right, Body, Icon, Card, CardItem, Tab, Tabs,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import {
    StatusBar, View, Alert, TouchableOpacity, ListView,
    FlatList, StyleSheet, Text, Platform, Dimensions, TextInput
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView, { Marker } from 'react-native-maps';
import Firebase, { db } from '../database/firebase_config';

let ref = Firebase.database().ref("/user_data");

class ActivityAdding extends Component {
    constructor(props) {
        super(props);
        this.scroller = null;
        this.state = {
            userName: "",
            weight: "", //kg
            pulse: "", //100
            blood_pressure: "",  //100
            sleep: "", //hours
            steps: "", //steps
            exercises: "" //mins
        };
    };

    addToFirestore = async () => {
        const record = {
            email: this.props.user.email,
            timestamp: (new Date().getTime().toString()),
            data:
            {
                userName: this.state.userName,
                weight: parseFloat(this.state.weight), //kg
                pulse: parseFloat(this.state.pulse), //100
                blood_pressure: parseFloat(this.state.blood_pressure),  //100
                sleep: parseInt(this.state.sleep), //hours
                steps: parseInt(this.state.steps), //steps
                exercises: parseInt(this.state.exercises) //mins
            }
        }

        await db.collection('daily_record')
            .doc(this.props.user.email + "_" + record.timestamp)
            .set(record);

        this.props.getAllPersonalRecords(user.email);

    };

    componentWillMount = () => {
        // this.setState({ userName: this.props.navigation.state.params.username });
        this.setState({ userName: 'person1' });
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
                            Adding Daily Record
                         </Text>
                    </View>

                    <TouchableOpacity
                        onPress={this.addToFirestore}
                    >
                        <Text>Save</Text>
                    </TouchableOpacity>

                    <TextInput
                        keyboardType="numeric"
                        style={styles.inputBox}
                        onChangeText={text => this.setState({ weight: text })}
                        placeholder='Weight'
                        autoCapitalize='none'
                    />

                    <TextInput
                        keyboardType="numeric"
                        style={styles.inputBox}
                        onChangeText={text => this.setState({ pulse: text })}
                        placeholder='Pulse'
                        autoCapitalize='none'
                    />

                    <TextInput
                        keyboardType="numeric"
                        style={styles.inputBox}
                        onChangeText={text => this.setState({ blood_pressure: text })}
                        placeholder='Blood Pressure'
                        autoCapitalize='none'
                    />


                    <TextInput
                        keyboardType="numeric"
                        style={styles.inputBox}
                        onChangeText={text => this.setState({ sleep: text })}
                        placeholder='Sleep'
                        autoCapitalize='none'
                    />

                    <TextInput
                        keyboardType="numeric"
                        style={styles.inputBox}
                        onChangeText={text => this.setState({ steps: text })}
                        placeholder='Steps'
                        autoCapitalize='none'
                    />

                    <TextInput
                        keyboardType="numeric"
                        style={styles.inputBox}
                        onChangeText={text => this.setState({ exercises: text })}
                        placeholder='Exercises'
                        autoCapitalize='none'
                    />

                </ScrollView>

            </Container >
        );

    }
}

ActivityAdding.navigationOptions = {
    headerShown: true,
    headerTransparent: true,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebf0"
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'left'
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

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail, updatePassword, login, getUser, getAllPersonalRecords }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivityAdding)