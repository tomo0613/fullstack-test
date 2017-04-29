import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import notificationReducer from 'reducers/notificationReducer';
import modalReducer from 'reducers/modalReducer';
import userManagerReducer from 'reducers/userManagerReducer';

const reducer = combineReducers({
    notificationStore: notificationReducer,
    modalStore: modalReducer,
    userManager: userManagerReducer,
    form: formReducer
});

const socket = io('/');

const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

const notificationMiddleware = (store) => (next) => (action) => {
    if (action.notification) {
        store.dispatch({type: `client/notification`, data: action.notification});
    }
    return next(action);
};

const middlewares = [socketIoMiddleware, notificationMiddleware];

export default createStore(reducer, applyMiddleware(...middlewares));
