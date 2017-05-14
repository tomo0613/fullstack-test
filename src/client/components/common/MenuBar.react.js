import React from 'react';
import { connect } from 'react-redux';
import userManagerActions from 'actions/userManagerActions';

const menuButtons = [
    {
        label: 'signOut',
        handleClick: userManagerActions.signOut
    },
    {
        label: 'manageUsers',
        reqiredRole: ['admin'],
        handleClick: () => {console.log(asd)}
    }
];

class MenuBar extends React.Component {
    render() {
        return React.DOM.div(
            {className: 'menuBar'},
            menuButtons.map((button) => this.createButton(button))
        );
    }

    createButton(button) {
        if (button.reqiredRole && button.reqiredRole.indexOf(this.props.role) === -1) {
            return null;
        }
        return React.DOM.button({
            key: button.label,
            onClick: button.handleClick
        }, button.label)
    }
}

function getProps(store) {
    return {
        role: store.userManager.signedAs
    };
}

export default connect(getProps)(MenuBar);
