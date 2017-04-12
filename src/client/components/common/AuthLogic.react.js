import React from 'react';
import { connect } from 'react-redux';
import AuthForm from './AuthForm.react';
import userManagerActions from '../../actions/userManagerActions';

class AuthLogic extends React.Component {
    render() {
        return this.props.signedIn ? (
            this.props.children
        ) : (
            React.createElement(AuthForm, {
                signInAction: userManagerActions.signIn,
                signUpAction: userManagerActions.signUp
            })
        );
    }
}

function getProps(store) {
    return {
        signedIn: store.userManager.signedIn
    };
}

export default connect(getProps)(AuthLogic);
