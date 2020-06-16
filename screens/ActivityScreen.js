
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
    FlatList, StyleSheet, Text, Platform, Dimensions
} from "react-native";
import axios from "axios";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Firebase from '../database/firebase_config';

let ref = Firebase.database().ref('coordinates');


class ActivityScreen extends Component {
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
            samplePercentFill: this.excerciseList[0]
        };
    };

    componentWillMount = () => {
        // this.setState({ userName: this.props.navigation.state.params.username });
        this.setState({ userName: this.props.user.nickname });
        this.findCurrentLocationAsync();
    };

    componentDidMount = () => {
        console.log(this.props.user.records)
        let interval = setInterval(() => {
            this.findCurrentLocationAsync();
            this.updateCoordToDatabase(this.state.userName);
            console.log("The coordinates were changed.");
        }, 15000);
        this.setState({ intervalIsSet: interval });
    };

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


    findCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);

                let coordset = {
                    x: latitude,
                    y: longitude
                };

                coordset = this.getCoordinates(coordset);

                this.setState({
                    latitude: coordset.x,
                    longitude: coordset.y
                });
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

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
        updateLat = this.state.latitude
        updateLon = this.state.longitude
        dataLocation = {
            x: updateLat,
            y: updateLon            
        }
        Firebase.collection('coordinates').doc('zwenyantoe').set(dataLocation)

        // ref.orderByChild("id").equalTo(id_toupdate).on("child_added", (snapshot) => {
        //     if (snapshot.val() === null) {
        //     } else {
        //         snapshot.ref.update({
        //             latitude: this.state.latitude,
        //             longitude: this.state.longitude
        //         });
        //     }
        // });
    };

    monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    excerciseList = [{
        icon: 'md-fitness',
        type: 'Exercises',
        number: this.props.user.records.today.exercises,
        unit: 'mins',
        per: 90
    }, {
        icon: '',
        type: 'Steps',
        number: this.props.user.records.today.steps,
        unit: 'steps',
        per: 100
    }, {
        type: 'Sleep',
        number: this.props.user.records.today.sleep,
        unit: 'hours',
        per: 8
    }]

    last7days_excerciseList = [{
        icon: 'md-fitness',
        type: 'Exercises',
        number: this.props.user.records.sevenDays.exercises,
        unit: 'mins',
        per: 630
    }, {
        icon: '',
        type: 'Steps',
        number: this.props.user.records.sevenDays.steps,
        unit: 'steps',
        per: 700
    }, {
        type: 'Sleep',
        number: this.props.user.records.sevenDays.sleep,
        unit: 'hours',
        per: 56
    }]

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
        // if (this.state.coordAvailable == false) {
        //     console.log("Coordonnates not loaded! :(");
        //     return <AppLoading />;
        // } else {
        const cardWidth = '32.5%';
        return (
            <Container>
                <StatusBar barStyle="dark-content" />

                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>

                    <View style={{ flexDirection: 'row' }}>
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

                            {/* <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('ActivityAdd')
                            }}>
                                <Text style={{ fontSize: 25 }}>
                                    Add +
                            </Text>

                            </TouchableOpacity> */}



                        </View>


                    </View>


                    <View style={{
                        flex: 1, flexDirection: 'row',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}>
                        <AnimatedCircularProgress
                            size={230}
                            width={10}
                            fill={(this.state.samplePercentFill.number / this.state.samplePercentFill.per) * 100}
                            // tintColor={this.state.samplePercentFill.number >= 50 ? 'aquamarine' : '#fccb00'}
                            tintColor='#fccb00'
                            backgroundColor="#3d5875">
                            {
                                (fill) => (
                                    <View style={{ alignItems: 'flex-start' }}>
                                        <Text style={{ color: 'rgba(0,0,0,0.5)' }}>
                                            {this.state.samplePercentFill.type}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 60 }}>
                                                {this.state.samplePercentFill.number}
                                            </Text>
                                            <Text style={{ fontSize: 25 }}>
                                                /{this.state.samplePercentFill.per}
                                            </Text>
                                        </View>

                                        <Text style={{ color: 'rgba(0,0,0,0.25)' }}>
                                            {this.state.samplePercentFill.unit}
                                        </Text>
                                    </View>

                                )
                            }
                        </AnimatedCircularProgress>
                    </View>


                    <View style={{
                        marginBottom: 30, marginTop: 30,
                        flex: 1, flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {this.excerciseList.map((element, key) => (
                            <View key={key} transparent style={{
                                borderLeftWidth: 1,
                                borderLeftColor: key == 0 ? 'white' : 'rgba(0,0,0,0.1)',
                                width: cardWidth,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ samplePercentFill: element })
                                }}>
                                    <Text>
                                        {element.type}
                                    </Text>
                                    <Text style={{ fontSize: 25 }}>
                                        {element.number}
                                    </Text>
                                    <Text>
                                        {element.unit}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        ))}



                    </View>

                    {/* <Text>Today</Text> */}

                    <View style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 12, padding: 20 }}>
                        <Text style={{
                            width: '100%',
                            fontSize: 20,
                            fontFamily: 'MuseoBold',
                            fontWeight: '400',
                            // textAlign: 'center'
                        }}>This Week</Text>
                        <View style={{
                            marginBottom: 30, marginTop: 30,
                            flex: 1, flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            {this.last7days_excerciseList.map((element, key) => (
                                <View key={key} transparent style={{
                                    // borderLeftWidth: 1,
                                    // borderLeftColor: key == 0 ? 'white' : 'rgba(0,0,0,0.1)',
                                    width: cardWidth,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0
                                }}>
                                    <AnimatedCircularProgress
                                        size={80}
                                        width={10}
                                        fill={(element.number / element.per) * 100}
                                        tintColor={(element.number / element.per) * 100 >= 50 ? 'aquamarine' : '#fccb00'}
                                        backgroundColor="#3d5875">
                                        {
                                            (fill) => (
                                                <View style={{ alignItems: 'flex-start' }}>
                                                    <Text style={{ color: 'rgba(0,0,0,0.5)' }}>
                                                        {element.number}
                                                    </Text>
                                                </View>)}
                                    </AnimatedCircularProgress>
                                    <Text>
                                        {element.type}
                                    </Text>
                                    {/* <Text style={{ fontSize: 25 }}>
                                        {element.number}
                                    </Text> */}
                                    <Text>
                                        {element.unit}
                                    </Text>
                                </View>

                            ))}



                        </View>
                    </View>

                    {/* 
                    <Button
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                        light onPress={() => { this.props.navigation.navigate('Home'); }}>
                        <Text>Back</Text>
                    </Button> */}

                </ScrollView>
                {/* <Footer>
                    <FooterTab>
                        <Button vertical>
                            <Icon name="apps" />
                            <Text>Add</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="camera" />
                            <Text>Report</Text>
                        </Button>
                    </FooterTab>
                </Footer> */}
            </Container >
        );
    }
    // }
}

ActivityScreen.navigationOptions = {
    headerStyle: {
        shadowColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
    },
    headerTitleStyle: {
        fontFamily: 'MuseoBold',
        fontWeight: "200"
    },
    title: 'Activity',
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

export default connect(mapStateToProps)(ActivityScreen)