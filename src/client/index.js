//TODO use absolute paths
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import store from './store/store';

import UserManagerForm from './components/admin/UserManagerForm.react';
import UsersList from './components/admin/UsersList.react';
import userManagerActions from './actions/userManagerActions';
import AuthForm from './components/common/AuthForm.react'
import NotificationComponent from './components/common/NotificationComponent.react';

import style from './style/main.scss';

class Main extends React.Component {
    render() {
        return React.DOM.div(
            {},
            React.DOM.h1({}, 'Hello world!'),
            React.createElement(UserManagerForm, {
                onSubmit: userManagerActions.submitForm,
                initialValues: {method: 'getUser'}
            }),
            React.createElement(UsersList),
            React.createElement(AuthForm, {
                signInAction: userManagerActions.signIn,
                signOutAction: userManagerActions.signOut
            }),
            React.createElement(NotificationComponent)
        );
    }
}

ReactDOM.render(
    React.createElement(Provider,
        {store: store},
        React.createElement(Router,
            {history: createHistory()},
            React.createElement(Route,
                {path: '/', component: Main}/*,
                React.createElement(Route, {})*/
            )
        )
    ), document.getElementById('rootElement')
);
