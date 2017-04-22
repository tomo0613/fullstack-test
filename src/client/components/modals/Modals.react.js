import React from 'react';
import userManagerActions from 'actions/userManagerActions';
import SignUpForm from 'components/modals/SignUpForm.react';

export default (modalId) => {
    switch (modalId) {
        case 'signUp':
            return {
                title: 'Sign up',
                dimensions: {width: '320px', height: '240px'},
                create: (props) => React.createElement(SignUpForm, {onSubmit: userManagerActions.signUp})
            };
        default:
            return null;
    }
};
