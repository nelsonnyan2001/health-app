import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEmail, updatePassword, updateNickname, signup, getUser } from '../Reducers/FriendActions_Custom';
import Firebase from '../database/firebase_config';

class Signup extends React.Component {

    handleSignUp = () => {
        try {
            this.props.signup();
            if (this.props.user.uid != null && this.props.user.uid != '') {
                console.log(this.props.user);
                this.props.navigation.navigate('Main');
            }
        } catch (e) {

        }

    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={nickname => this.props.updateNickname(nickname)}
                    placeholder='Nickname'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    onChangeText={email => this.props.updateEmail(email)}
                    placeholder='Email'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.inputBox}
                    onChangeText={password => this.props.updatePassword(password)}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleSignUp}
                // onPress={this.props.signup()}

                >
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
        )
    }
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
        backgroundColor: '#FFA611',
        borderColor: '#FFA611',
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
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail, updatePassword, updateNickname, signup }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup);