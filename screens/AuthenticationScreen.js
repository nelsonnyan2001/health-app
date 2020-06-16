import React from 'react';
import { StyleSheet, Text, View, Modal, Keyboard, KeyboardAvoidingView, } from 'react-native';
import { Input, Button, ButtonGroup } from 'react-native-elements';

let faker = require('faker');
import Firebase from '../database/firebase_config';
let ref = Firebase.database().ref("/user_data");

export default class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signedInUser: '',
            email: '',
            password: '',
            confirmPassword: '',
            confirmationCode: '',
            duplicateUsername: false,
            selectedIndex: 0,
        };

        this.buttons = ['Sign Up', 'Sign In']
    }

    componentWillMount = () => {
        // //Fetch all user list:
        // let userList = [];
        // ref.once("value", async (snapshot) => {
        //     let data = snapshot.val();   //Data is in JSON format.
        //     data.forEach((element)=>{
        //         userList.push(element['id']);
        //     });
        //     await this.setState({ datum: data });
        //   });
    }

    updateIndex = () => {
        // If selectedIndex was 0, make it 1.  If it was 1, make it 0
        const newIndex = this.state.selectedIndex === 0 ? 1 : 0
        this.setState({ selectedIndex: newIndex })
    }

    handleSignIn = () => {

        const { email, password } = this.state;
        this.props.navigation.navigate('Home', { username: this.state.email });
    }

    handleSignUp = async () => {
        const { email, password, confirmPassword } = this.state;
        console.log("Pushing is running: " + this.state.email);

        let toCreateUsername = !(await this.checkExistingUsername(this.state.email));
        console.log('To create new acc: ' + toCreateUsername);
        if (toCreateUsername === true) {
            this.setState({ duplicateUsername: false });
            console.log("==> Will create a new username here");
            ref.push({
                id: this.state.email,
                name: faker.name.findName(),
                email: faker.internet.email(),
            });
            this.props.navigation.navigate('Home', { username: this.state.email });
        } else {
            this.setState({ duplicateUsername: true });
        }
    }

    checkExistingUsername = (username) => {
        return new Promise((resolve, reject) => {
            ref.orderByChild("id").equalTo(username).once("value", (snapshot) => {
                console.log("This username is existing? " + snapshot.exists());
                console.log("This is " + snapshot.val());
                if (snapshot.exists()) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        })
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior="padding"
                style={styles.container}
                enabled>
                <Text>Welcome to my Health App!</Text>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={this.state.selectedIndex}
                    buttons={this.buttons}
                />
                {this.state.selectedIndex === 0 ? (
                    <View style={styles.form}>
                        {this.state.duplicateUsername === true ? (
                            <Text style={{ color: "red" }}>
                                This username is already taken
                            </Text>
                        ) : (
                                <Text></Text>
                            )}
                        <Input
                            autoCapitalize='none'
                            label="Username"
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={
                                (value) => this.setState({ email: value })
                            }
                            placeholder="personN"
                        />
                        <Button
                            title='Submit'
                            onPress={this.handleSignUp}
                        />
                    </View>
                ) : (
                        <View style={styles.form}>
                            <Input
                                label="Username"
                                autoCapitalize='none'
                                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                                onChangeText={
                                    (value) => this.setState({ email: value })
                                }
                                placeholder="username"
                            />
                            <Button
                                title='Submit'
                                onPress={this.handleSignIn}
                            />
                        </View>
                    )}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        width: '90%',
    }
});