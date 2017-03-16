import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import UserManagerForm from './components/admin/UserManagerForm.react';
import UsersList from './components/admin/UsersList.react';
import userManagerActions from './actions/userManagerActions';

class Main extends React.Component {
    render() {
        return React.DOM.div(
            {},
            React.DOM.h1({}, 'Hello world!'),
            React.createElement(UserManagerForm, {
                onSubmit: userManagerActions.submitForm,
                initialValues: {method: 'getUser'}
            }),
            React.createElement(UsersList)
        );
    }
}

ReactDOM.render(
    //TODO + React router
    React.createElement(Provider, {store: store}, React.createElement(Main)),
    document.getElementById('mainContainer')
);
