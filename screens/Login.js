import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button, StatusBar } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEmail, updatePassword, login, getUser, getAllPersonalRecords } from '../Reducers/FriendActions_Custom';
import Firebase from '../database/firebase_config';

class Login extends React.Component {

    componentDidMount = () => {

        Firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                await this.props.getUser(user.uid);
                if (this.props.user != null) {
                    console.log(user);
                    // this.props.getAllPersonalRecords(user.email);
                    this.props.navigation.navigate('Main');
                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <TextInput
                    style={styles.inputBox}
                    value={this.props.user.email}
                    onChangeText={email => this.props.updateEmail(email)}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    value={this.props.user.password}
                    onChangeText={password => this.props.updatePassword(password)}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={() => {
                    this.props.login();
                    if (this.props.user.uid != null && this.props.user.uid != '') {
                        console.log(this.props.user);
                        this.props.navigation.navigate('Main');
                    }
                }}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Button
                    title="Don't have an account yet? Sign up"
                    onPress={() => this.props.navigation.navigate('Signup')}
                />
            </View>
        )
    }
}

Login.navigationOptions = {
    title: 'Login'
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#F6820D',
        borderColor: '#F6820D',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonSignup: {
        fontSize: 12
    }
})

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
)(Login)