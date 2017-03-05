import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import userManagerReducer from '../reducers/userManagerReducer';

const socket = io('/');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const reducers = {
    userManager: userManagerReducer,
    // ... your other reducers here ...
    form: formReducer
};

const reducer = combineReducers(reducers);
const store = applyMiddleware(socketIoMiddleware)(createStore)(reducer);

export default store;
