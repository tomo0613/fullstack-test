import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import userManagerReducer from '../reducers/userManagerReducer';

const socket = io('/');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

///
function testMiddleware({ getState }) {
  return ({ dispatch, getState }) => (next) => (action) => {
    // console.log('will dispatch', action)

    if (action.type === 'submitForm') {
        console.log('MIDDLEWARE CATCHES submitForm');
    }

    // Call the next dispatch method in the middleware chain.
    let returnValue = next(action)

    // console.log('state after dispatch', getState())

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue
  }
}
///

const reducers = {
    userManager: userManagerReducer,
    // ... your other reducers here ...
    form: formReducer
};

const reducer = combineReducers(reducers);
const middlewares = [socketIoMiddleware];
const store = applyMiddleware(...middlewares)(createStore)(reducer);
// const store = createStore(reducer, applyMiddleware(...middlewares));

export default store;
