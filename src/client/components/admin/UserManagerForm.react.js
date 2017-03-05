import React from 'react';
import {Field, reduxForm} from 'redux-form';

class UserManagerForm extends React.Component {
    render() {
        const {handleSubmit} = this.props;
        return React.DOM.form(
            {
                onSubmit: handleSubmit
            },
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'userId'}, 'USERID'),
                React.createElement(Field, {
                    name: 'userId',
                    component: 'input',
                    type: 'text'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'username'}, 'USERNAME'),
                React.createElement(Field, {
                    name: 'username',
                    component: 'input',
                    type: 'text'
                })
            ),
            React.DOM.div(
                {},
                React.DOM.label({htmlFor: 'email'}, 'EMAIL'),
                React.createElement(Field, {
                    name: 'email',
                    component: 'input',
                    type: 'text'
                })
            ),
            React.DOM.button({type: 'submit'}, 'SUBMIT')
        );
    }
}

UserManagerForm = reduxForm({
    form: 'userManager'
})(UserManagerForm);

export default UserManagerForm;
