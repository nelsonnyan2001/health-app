import { combineReducers } from 'redux';

const INITIAL_STATE = {
    current: [],
    possible: [],
};

import { LOGIN, SIGNUP, UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_NICKNAME, GETALLDAILYRECORDS, GETMEDICINES } from './FriendActions_Custom';

const user = (state = {}, action) => {
    switch (action.type) {
        case LOGIN:
            return action.payload;
        case SIGNUP:
            console.log('Signup OK:');
            console.log(action.payload);
            return action.payload;
        case GETALLDAILYRECORDS:
            return { ...state, records: action.payload };
        case UPDATE_EMAIL:
            return { ...state, email: action.payload };
        case UPDATE_NICKNAME:
            return { ...state, nickname: action.payload };
        case UPDATE_PASSWORD:
            return { ...state, password: action.payload };
        case GETMEDICINES:
            return { ...state, medicines: action.payload };
        default:
            return state;
    }
};

const friendReducer = (state = INITIAL_STATE, action) => {
    const { current, possible, } = state;
    let addedFriend = null;
    let newState = null;
    switch (action.type) {
        case 'CUSTOM':
            addedFriend = action.payload;
            console.log("CUSTOM: Adding Friend (Custom): " + JSON.stringify(addedFriend));
            current.push(addedFriend);
            newState = { current, possible };
            console.log("New state is below:");
            console.log(newState);
            return newState;
        case 'ADD_FRIEND':
            addedFriend = possible.splice(action.payload, 1);
            console.log("ADD_FRIEND: Adding Friend: " + addedFriend);
            current.push(addedFriend);

            newState = { current, possible };
            console.log(
                "New state is below:"
            );
            console.log(newState);
            return newState;
        default:
            return state;
    }
};

export default combineReducers({
    friends: friendReducer,
    user: user
});