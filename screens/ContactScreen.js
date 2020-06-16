import React, { Component } from 'react';
import { Linking } from 'react-native';
import { View, Title } from 'react-native';
import {
    Container, Header, Content, Form,
    Item, Input, Label, List, ListItem,
    Body, Right, Button, Text, Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export default class ContactScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            phoneNumbers: []
        };
    }

    handlePressSave = (value) => {
        let phoneNums = this.state.phoneNumbers;
        phoneNums.unshift(value);
        this.setState({ phoneNumber: phoneNums });
        this.setState({ phoneNumber: "" });
    }

    handlePressCall = (phoneNum) => {
        let url = "tel://" + phoneNum;
        Linking.openURL(url);
    };

    render() {
        const phoneList = this.state.phoneNumbers.map((aNumber) => {
            return (
                <ListItem key={aNumber}>
                    <Body>
                        <Text>{aNumber}</Text>
                    </Body>
                    <Right>
                        <Button iconLeft onPress={() => this.handlePressCall(aNumber)}>
                            <Icon name='call' />
                            <Text>Call</Text>
                        </Button>
                    </Right>
                </ListItem>
            );
        });

        return (
            <Container style={{ padding: 10 }}>
                <Content>
                    <Text>Emergency Contacts</Text>
                    <Form>
                        <Item floatingLabel>
                            <Label>Phone Number</Label>
                            <Input placeholder="Token"
                                onChangeText={(value) => this.setState({ phoneNumber: value })}
                                value={this.state.phoneNumber} />
                        </Item>
                    </Form>
                    <Text>{this.state.phoneNumber}</Text>

                    <Button
                        // title="Save"
                        onPress={() => { this.handlePressSave(this.state.phoneNumber); }}
                    >
                        <Text>Save</Text>
                    </Button>

                    {this.state.phoneNumbers.length === 0 ? (
                        <Text></Text>
                    ) : (
                            <List>
                                {phoneList}
                            </List>
                        )}
                </Content>
            </Container>
        );
    }
}

ContactScreen.navigationOptions = {
    title: 'Contacts',
};