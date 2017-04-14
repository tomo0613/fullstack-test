import store from 'store/store';

const notificationComponentActions = {
    newNotification: (notification) => {
        store.dispatch({type: `client/notification`, data: notification});
    }
};

export default notificationComponentActions;
