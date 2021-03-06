import store from 'store/store';

const userManagerActions = {
    submitAdminForm: (form) => {
        const data = {
            name: form.username,
            email: form.email,
            passwd: form.password
        };
        const token = localStorage.getItem('jwt');
        store.dispatch({
            type: 'server/' + form.method,
            userId: form.userId,
            postData: data,
            token: token
        });
    },
    signIn: (form) => {
        const credentials = {passwd: form.password};
        store.dispatch({
            type: 'server/authenticateUser',
            userId: form.username,
            postData: credentials
        });
    },
    signOut: () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('role');
        store.dispatch({
            type: 'client/signOut'
        });
    },
    signUp: (form) => {
        console.log('signUp action');
        store.dispatch({
            type: 'server/signUp'
        });
    }
};

export default userManagerActions;
