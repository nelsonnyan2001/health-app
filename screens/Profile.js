import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Firebase from '../database/firebase_config';
import { Avatar } from 'react-native-elements';

import {
    Container, Header, Title, Content, Footer,
    FooterTab, Left, Right, Body, Icon, Card, CardItem, List, ListItem, Thumbnail
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Profile extends React.Component {
    handleSignout = () => {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    render() {
        const summaryData = [
            [{
                category: 'Exercises',
                value: 35,
                navigateTo: 'Activity',
                backgroundColor: "#ffdfac",
                fontColor: "#ad5c0b"
            }, {
                category: 'Sleep',
                value: 35,
                navigateTo: 'Activity',
                backgroundColor: "#91c3de",
                fontColor: "#007aa3"
            }],
            [{
                category: 'Steps',
                value: 980,
                navigateTo: 'Activity',
                backgroundColor: "#98ccc0",
                fontColor: "#388477"
            }, {
                category: 'Blood Pressure',
                value: 42,
                navigateTo: 'Activity',
                backgroundColor: "#ff818c",
                fontColor: "#a42b22"
            }]
        ]
        return (
            <Container>
                <Content style={{ padding: 10 }}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        // backgroundColor: 'aquamarine'
                    }}>
                        <Avatar
                            style={{ width: '35%', aspectRatio: 1, marginRight: 10 }}
                            rounded
                            size="large"
                            source={{
                                uri:
                                    'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                            }}
                        />
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            flex: 1
                        }}>
                            <Text style={{
                                fontSize: 22,
                                fontFamily: 'MuseoBold',
                                fontWeight: '400',
                                flexShrink: 1
                            }}>Joanna Nguyen</Text>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', alignItems: 'center'
                            }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 30 }}>68</Text>
                                    <Text style={{ color: 'rgba(0,0,0,0.3)' }}>Years Old</Text>
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 30 }}>57</Text>
                                    <Text style={{ color: 'rgba(0,0,0,0.3)' }}>Kg</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginBottom: 20, marginTop: 30 }}>
                        <Text style={{
                            fontSize: 25,
                            fontFamily: 'MuseoBold',
                            fontWeight: '400'
                        }}>At A Glance</Text>
                        <Text style={{ color: 'rgba(0,0,0,0.3)' }}>This Week</Text>
                    </View>

                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}>

                        {summaryData.map((element, key) => (
                            <View key={key} style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                {element.map((sub_element, sub_key) => {
                                    return (
                                        <Card transparent key={sub_key} style={{
                                            borderWidth: 0,
                                            borderColor: 'transparent',
                                            width: '48%'
                                        }}>
                                            <CardItem style={{
                                                borderRadius: 12,
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                justifyContent: 'flex-end',
                                                backgroundColor: sub_element.backgroundColor
                                            }}>
                                                <TouchableOpacity
                                                    onPress={() => { this.props.navigation.navigate(sub_element.navigateTo) }}
                                                >
                                                    <Body>
                                                        <Text style={{
                                                            color: sub_element.fontColor,
                                                            fontSize: 45
                                                        }}>
                                                            {sub_element.value}
                                                        </Text>
                                                        <Text style={{
                                                            color: sub_element.fontColor
                                                        }}>
                                                            {sub_element.category}
                                                        </Text>
                                                    </Body>
                                                </TouchableOpacity>
                                            </CardItem>
                                        </Card>
                                    )
                                })}
                            </View>
                        )
                        )}





                    </ScrollView>

                    {/* <Text>{this.props.user.email}</Text>
                    <Text>{this.props.user.nickname}</Text>
                    <Text>UID: {this.props.user.uid}</Text>
                    <Text>Name: {this.props.user.uid}</Text>
                    <Text>Age: {this.props.user.uid}</Text>
                    <Text>IC No.: {this.props.user.uid}</Text>
                    <Text>Allergies: {this.props.user.uid}</Text>
                    <Text>Health Condition: {this.props.user.uid}</Text> */}


                    <List>
                        <ListItem>
                            <Body>
                                <Text>Nickname</Text>
                                <Text style={{
                                    fontFamily: 'MuseoBold',
                                    fontWeight: '400',
                                    fontSize: 20
                                }}>{this.props.user.nickname}</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>Nickname</Text>
                                <Text style={{
                                    fontFamily: 'MuseoBold',
                                    fontWeight: '400',
                                    fontSize: 20
                                }}>{this.props.user.email}</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>Age</Text>
                                <Text style={{
                                    fontFamily: 'MuseoBold',
                                    fontWeight: '400',
                                    fontSize: 20
                                }}>68</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>IC No.</Text>
                                <Text style={{
                                    fontFamily: 'MuseoBold',
                                    fontWeight: '400',
                                    fontSize: 20
                                }}>8922HNC</Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Body>
                                <Text>Health Condition</Text>
                                <Text style={{
                                    fontFamily: 'MuseoBold',
                                    fontWeight: '400',
                                    fontSize: 20
                                }}>Good</Text>
                            </Body>
                        </ListItem>
                    </List>


                    <Button title='Logout' onPress={this.handleSignout} />

                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('Emergency'); }}
                    >
                        <Card>
                            <CardItem>
                                <Body>
                                    <Text>
                                        Emergency Contact
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    </TouchableOpacity>

                </Content>
            </Container>
        )
    }
}

Profile.navigationOptions = {
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
    title: 'Profile',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    contentContainer: {
        // alignItems: 'center',
        // justifyContent: 'center'
    },
});

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)