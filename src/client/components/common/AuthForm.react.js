import React from 'react';
import notificationActions from 'actions/notificationActions';
import modalActions from 'actions/modalActions';

class AuthForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        return React.DOM.div(
            {id: 'AuthForm'},
            React.DOM.input({
                placeholder: 'username',
                onBlur: (e) => this.setState({username: e.target.value})
            }),
            React.DOM.input({
                placeholder: 'password',
                type: 'password',
                onBlur: (e) => this.setState({password: e.target.value})
            }),
            React.DOM.button({
                onClick: () => this.checkCredentials() && this.props.signInAction(this.state)
            }, 'signIn'),
            React.DOM.button({
                onClick: () => modalActions.open('signUp')
            }, 'signUp')
        );
    }

    checkCredentials() {
        if (!this.state.username || !this.state.password) {
            notificationActions.newNotification('warning@missing.credentials');
            return false;
        }
        return true;
    }
}

export default AuthForm;
