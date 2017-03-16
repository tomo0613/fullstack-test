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
                    'getUser'
                ),
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'addUser'
                    }),
                    'addUser'
                ),
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'updateUser'
                    }),
                    'updateUser'
                ),
                React.DOM.label(
                    {},
                    React.createElement(Field, {
                        name: 'method',
                        component: 'input',
                        type: 'radio',
                        value: 'deleteUser'
                    }),
                    'deleteUser'
                )
            ),
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'userId'}, 'USERID'),
                React.createElement(Field, {
                    name: 'userId',
                    component: 'input',
                    type: 'text',
                    placeholder: '* / userId'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'username'}, 'USERNAME'),
                React.createElement(Field, {
                    name: 'username',
                    component: 'input',
                    type: 'text',
                    disabled: this.props.method === 'getUser' || this.props.method === 'deleteUser'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({}, 'EMAIL'),
                React.createElement(Field, {
                    name: 'email',
                    component: 'input',
                    type: 'text',
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

const selector = formValueSelector('userManager');

UserManagerForm = connect(
    (state) => {
        const method = selector(state, 'method');
        return {method};
    }
)(UserManagerForm);

export default UserManagerForm;
