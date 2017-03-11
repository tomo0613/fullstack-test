import store from '../store/store';

const userManagerActions = {
    submitForm: (form) => {
        console.log('\nuserManagerActions -> submitForm: ', form);
        store.dispatch({type: `server/${form.method}`, data: {form: form}});
    }
};

export default userManagerActions;
