import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import userManagerReducer from '../reducers/userManagerReducer';

const socket = io('/');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

///
const testMiddleware = (store) => (next) => (action) => {
    if (['server/addUser', 'server/updateUser', 'server/deleteUser'].indexOf(action.type) > -1) {
        // console.log('middleware dispatch server/getUser');
        //TODO wait for prev action
        store.dispatch({type: `server/getUser`, data: {}});
    }

    return next(action);
};

const reducers = {
    userManager: userManagerReducer,
    // ... your other reducers here ...
    form: formReducer
};

const reducer = combineReducers(reducers);
const middlewares = [socketIoMiddleware, testMiddleware];
// const store = applyMiddleware(...middlewares)(createStore)(reducer);
const store = createStore(reducer, applyMiddleware(...middlewares));

export default store;
