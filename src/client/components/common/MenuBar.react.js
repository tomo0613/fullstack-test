import React from 'react';

class MenuBar extends React.Component {
    render() {
        return React.DOM.div({},
            React.DOM.button({
                onClick: () => this.props.signOutAction()
            }, 'signOut')
        );
    }
}

export default MenuBar;
