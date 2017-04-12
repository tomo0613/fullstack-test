//TODO use absolute paths
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';

import UserManagerForm from './components/admin/UserManagerForm.react';
import UsersList from './components/admin/UsersList.react';
import userManagerActions from './actions/userManagerActions';
import AuthLogic from './components/common/AuthLogic.react';
import MenuBar from './components/common/MenuBar.react';
import NotificationComponent from './components/common/NotificationComponent.react';

import style from './style/main.scss';

class Main extends React.Component {
    render() {
        return React.DOM.div(
            {className: 'mainContainer'},
            React.DOM.h1({}, 'Hello world!'),
            React.createElement(AuthLogic, {},
                React.createElement(MenuBar, {
                    signOutAction: userManagerActions.signOut
                })
            ),
            React.createElement(UserManagerForm, {
                onSubmit: userManagerActions.submitAdminForm,
                initialValues: {method: 'getUser'}
            }),
            React.createElement(UsersList),
            React.createElement(NotificationComponent)
        );
    }
}

ReactDOM.render(
    React.createElement(Provider, {store: store},
        React.createElement(Main)
    ), document.getElementById('rootElement')
);
