
import React, { Component } from "react";
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
import { updateEmail, updatePassword, login, getUser, getAllPersonalRecords } from '../Reducers/FriendActions_Custom';
import Firebase from '../database/firebase_config';
import { setCustomText } from 'react-native-global-props';
import * as dbconsts from '../database/firebase_config';

let ref = Firebase.database().ref("/coordinates");

class push_test extends Component {
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
            intervalIsSet: false,
            othersInfo: {},
            userName: "",
            scrollPos: new Animated.Value(0)
        };
    };

    componentWillMount = () => {
        this.findCurrentLocationAsync();
    };

    componentDidMount = () => {
        console.log(this.props.user);
        this.setState({ userName: this.props.user.nickname });
        this.props.getAllPersonalRecords(this.props.user.email);
        let interval = setInterval(() => {
            this.findCurrentLocationAsync();
            this.updateCoordToDatabase(this.state.userName);
            console.log("The coordinates were changed.");
        }, 15000);
        this.setState({ intervalIsSet: interval });
        this.defaultFonts();
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
        updateData = {
            x: this.state.latitude,
            y: this.state.longitude
        }
        dbconsts.db.collection('coordinates').doc(id_toupdate).set(updateData)
        // ref.orderByChild("id").equalTo(id_toupdate).on("child_added", (snapshot) => {
        //     if (snapshot.val() === null) {
        //     } else {
        //         snapshot.ref.update({
        //             x: this.state.latitude,
        //             y: this.state.longitude
        //         });
        //     }
        // });
    };

    calculateShadowOpactity = () => {
        if (this.state.scrollPos <= 12.0) {
            return ((this.state.scrollPos / 2) / 10);
        } else {
            return (0.6);
        }
    }

    render() {
        var markers = [
            {
                latlng: {
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude,
                },
                title: "Your current latitude and longitude:",
                description: this.state.region.latitude + "," + this.state.region.latitude

            }
        ]
        if (!this.state.doneLoadingData){
            return(
                <View>
                    <Text>
                        Loading
                    </Text>
                </View>
            )
        }
        return (
            <View style={{
                flex: 1,
                flexDirection: "column",
            }}>
                <View style={{
                    flex: 0.2,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style = {{
                        alignSelf: "center",
                        fontSize: 18,

                    }}>
                        This is where you are currently located. Your location will update every 15 seconds.
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                }}>
                    <MapView
                        style={{ flex: 1 }}
                        region={this.state.region}
                    >
                        {markers.map(marker => (
                            <Marker
                                coordinate={marker.latlng}
                                title={marker.title}
                                description={marker.description}
                            />
                        ))}
                    </MapView>

                </View>

            </View>
        )

    }
    // }
}
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
)(push_test)
