import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { Card, CardItem, Content, Container, Button } from 'native-base'
import { Text as TextNative } from 'native-base'
import { Constants, Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import { ThemeConsumer } from 'react-native-elements'

async function getiOSNotificationPermission() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') {
        await Permissions.askAsync(Permissions.NOTIFICATIONS)
    }
}

export default class SimpleNotification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notiOn: false,
            token: ''
        }
    }

    componentWillMount() {
        this.getiOSNotificationPermission();
        this.getToken();
    }

    componentDidMount = () => {
        // this.externalInterval();
        // if (this.state.token) {
        // setInterval(
        //     () => {
        //         this.getSth();
        //         this.getNoti();
        //     }, 2000);
        // }
        // if (this.state.notiOn === true) {
        this.getNoti('Aspirin', 'Please use Aspirin', 2000);
        this.getNoti('Panadol', 'Please use Panadol', 5000);
        // }
    }

    // startNotifications = () => {
    //     this.getNoti('Aspirin', 'Please use Aspirin', 2000);
    //     this.getNoti('Panadol', 'Please use Panadol', 5000);
    // }

    async getiOSNotificationPermission() {
        const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
        if (status !== 'granted') {
            await Permissions.askAsync(Permissions.NOTIFICATIONS)
        }
    }

    // externalInterval() {
    //     setInterval(
    //         () => {
    //             this.getNoti();
    //         }, 2000);
    // }

    async getToken() {
        const token = await Notifications.getExpoPushTokenAsync()
        // console.log(token);
        this.setState({ token: token })
        console.log(this.state.token)
    }

    getNoti(title, description, interval) {
        setInterval(() => {
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'accept-encoding': 'gzip, deflate',
                    host: 'exp.host'
                },
                body: JSON.stringify({
                    to: this.state.token,
                    // to: 'ExponentPushToken[aAZoJIB2riCFDPxixF3VZw]', // THIS ONE MUST BE CHANGED SOON
                    title: title,
                    body: description,
                    priority: 'high',
                    sound: 'default',
                    channelId: 'default'
                })
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson)
                })
                .catch(error => {
                    console.log(error)
                })
        }, interval)
    }

    render() {
        return (
            <Container style={{ padding: 10 }}>
                <Content>
                    <Text>Hung</Text>

                    {/* {this.state.notiOn === false ?
                        (
                            <Button block success onPress={() => {
                                this.setState({ notiOn: true });
                                this.startNotifications();
                            }}>
                                <Text>Start Notifications</Text>
                            </Button>
                        ) : (
                            <Button block danger onPress={() => {
                                this.setState({ notiOn: false });
                            }}>
                                <Text>Stop Notifications</Text>
                            </Button>
                        )} */}

                    <Card>
                        <CardItem header>
                            <TextNative>Aspirin</TextNative>
                        </CardItem>
                        <CardItem>
                            <Text>Every 2 seconds.</Text>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <TextNative>Aspirin</TextNative>
                        </CardItem>
                        <CardItem>
                            <Text>Every 2 seconds.</Text>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem header>
                            <TextNative>Aspirin</TextNative>
                        </CardItem>
                        <CardItem>
                            <Text>Every 2 seconds.</Text>
                        </CardItem>
                    </Card>
                </Content>
            </Container >
        )
    }
}
