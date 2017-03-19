const initialState = {
    notifications: []
};
let newNotification;

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case 'server/notification':
            newNotification = {
                text: action.data,
                id: `${state.notifications.length}#${Date.now()}`,
                class: action.data.substring(0, action.data.indexOf('@')) || 'error'
            };
            return Object.assign({}, state, { notifications: state.notifications.concat([newNotification]) });
        default:
            return state;
    }
}
