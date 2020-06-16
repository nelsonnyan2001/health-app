import { createStore, applyMiddleware, compose } from 'redux';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// import thunk from 'redux-thunk';
const thunk = require('redux-thunk').default;
import friendReducer from './Reducers/FriendReducer';
const store = createStore(friendReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;