import React from 'react';
import { connect } from 'react-redux';

class NotificationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleNotifications: []
        };

        this.msToWait = 5000;
        this.timeoutStore = {};
        this.startFadeOutCountdown = this.startFadeOutCountdown.bind(this);
        this.cancelFadeOutCountdown = this.cancelFadeOutCountdown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.notifications) {
            return;
        }
        if (this.props.notifications.length < nextProps.notifications.length) {
            const currentNotification = nextProps.notifications[nextProps.notifications.length -1];
            const visibleNotifications = this.state.visibleNotifications.concat([currentNotification]);
            this.setState({
                visibleNotifications: visibleNotifications
            }, this.startFadeOutCountdown(currentNotification.id));
        }
    }

    render() {
        if (!this.state.visibleNotifications.length) {
            return null;
        }
        const notificationBubbles = this.state.visibleNotifications.map((notification) => {
            return React.DOM.div(
                {
                    key: notification.id,
                    id: notification.id,
                    className: notification.class,
                    onMouseEnter: () => this.cancelFadeOutCountdown(notification.id),
                    onMouseLeave: () => this.startFadeOutCountdown(notification.id),
                },
                //React.DOM.i({className: 'material-icon'}, 'icon-TODO'),
                notification.text,
                React.DOM.i({
                    onClick: () => {
                        this.cancelFadeOutCountdown(notification.id);
                        this.closeNotification(notification.id);
                    }
                }, 'x')//TODO material icons
            );
        });

        return React.DOM.div(
            {id: 'notificationComponent'},
            notificationBubbles
        );
    }
//1st Add class (fadin out) 2nd Remove el
    closeNotification(notificationId) {
        const visibleNotifications = this.state.visibleNotifications.filter((item) => item.id !== notificationId);
        this.setState({
            visibleNotifications: visibleNotifications
        });
    }

    startFadeOutCountdown(notificationId) {
        this.timeoutStore[notificationId] = setTimeout(() => {
            this.closeNotification(notificationId);
        }, this.msToWait);
    }

    cancelFadeOutCountdown(notificationId) {
        clearTimeout(this.timeoutStore[notificationId]);
    }
}

NotificationComponent = connect(
    (state) => {
        return {notifications: state.notificationStore.notifications};
    }
)(NotificationComponent);

export default NotificationComponent;
