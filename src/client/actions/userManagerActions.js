import store from '../store/store';

const userManagerActions = {
    submitForm: (form) => {
        console.log('\nuserManagerActions -> submitForm : ');
        console.log(form);
        // store.dispatch({type:'server/hello', data:'Hello!'});
        store.dispatch({type:'getForm', data: {form: form}});
    },
    refreshList: () => {
        console.log('\nuserManagerActions -> refreshList');
        store.dispatch({type:'server/getUser', data: []});
    },
    getUser: (userId) => {
        store.dispatch({type:'server/getUser', data: [userId]});
    }
};

export default userManagerActions;
