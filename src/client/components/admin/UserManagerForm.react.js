import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

class UserManagerForm extends React.Component {
    render() {
        return React.DOM.form(
            {
                onSubmit: this.props.handleSubmit
            },
            React.DOM.div(
                {},
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'getUser'
                    }),
                    'Find user(s)'
                ),
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'addUser'
                    }),
                    'Create user'
                ),
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'updateUser'
                    }),
                    'Update user'
                ),
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'deleteUser'
                    }),
                    'Delete user'
                )
            ),
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'userId'}, 'UUID'),
                React.createElement(Field, {
                    name: 'userId',
                    component: 'input',
                    type: 'text',
                    placeholder: '* / userId'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'username'}, 'Username: '),
                React.createElement(Field, {
                    name: 'username',
                    component: 'input',
                    type: 'text',
                    disabled: this.props.method === 'getUser' || this.props.method === 'deleteUser'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({}, 'E-mail: '),
                React.createElement(Field, {
                    name: 'email',
                    component: 'input',
                    type: 'text',
                    disabled: this.props.method === 'getUser' || this.props.method === 'deleteUser'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({}, 'Password: '),
                React.createElement(Field, {
                    name: 'password',
                    component: 'input',
                    type: 'password',
                    disabled: this.props.method === 'getUser' || this.props.method === 'deleteUser'
                })
            ),
            React.DOM.button({type: 'submit'}, 'SUBMIT')
        );
    }
}

UserManagerForm = reduxForm({
    form: 'userManager'
})(UserManagerForm);

function getProps(store) {
    const selector = formValueSelector('userManager');
    return {method: selector(store, 'method')};
}

export default connect(getProps)(UserManagerForm);
