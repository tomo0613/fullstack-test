import store from '../store/store';

const userManagerActions = {
    submitForm: (form) => {
        const data = {
            name: form.username,
            email: form.email
        };
        store.dispatch({type: `server/${form.method}`, userId: form.userId, userData: data});
    }
};

export default userManagerActions;
