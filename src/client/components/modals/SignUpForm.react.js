import React from 'react';
import { Field, reduxForm } from 'redux-form';

class SignUpForm extends React.Component {
    render() {
        return React.DOM.form(
            {
                onSubmit: this.props.handleSubmit
            },
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'username'}, 'Username: '),
                React.createElement(Field, {
                    name: 'username',
                    component: 'input',
                    type: 'text',
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({}, 'E-mail: '),
                React.createElement(Field, {
                    name: 'email',
                    component: 'input',
                    type: 'text'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({}, 'Password: '),
                React.createElement(Field, {
                    name: 'password',
                    component: 'input',
                    type: 'password'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({}, 'Password confirm: '),
                React.createElement(Field, {
                    name: 'passwordConfirm',
                    component: 'input',
                    type: 'password'
                })
            ),
            React.DOM.button({type: 'submit'}, 'SUBMIT')
        );
    }
}

SignUpForm = reduxForm({
    form: 'signUp'
})(SignUpForm);

export default SignUpForm;
