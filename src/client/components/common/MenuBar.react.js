import React from 'react';

class MenuBar extends React.Component {
    render() {
        return React.DOM.div(
            {className: 'menuBar'},
            React.DOM.button({
                onClick: () => this.props.signOutAction()
            }, 'signOut')
        );
    }
}

export default MenuBar;
