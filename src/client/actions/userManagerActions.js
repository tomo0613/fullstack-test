import store from '../store/store';

const userManagerActions = {
    submitForm: (form) => {
        const data = {
            name: form.username,
            email: form.email,
            passwd: form.password
        };
        const token = localStorage.getItem('jwt');
        store.dispatch({type: `server/${form.method}`, userId: form.userId, userData: data, token: token});
    },
    signIn: (form) => {
        const credentials = {passwd: form.password};
        store.dispatch({type: `server/authenticateUser`, userId: form.username, userData: credentials});
    },
    signOut: () => {
        localStorage.removeItem('jwt');
    }
};

export default userManagerActions;
