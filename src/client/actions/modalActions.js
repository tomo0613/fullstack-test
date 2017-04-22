import store from 'store/store';

const modalActions = {
    open: (modalId) => {
        store.dispatch({type: `client/openModal`, data: modalId});
    },
    close: () => {
        console.log('close');
        store.dispatch({type: `client/closeModal`});
    }
};

export default modalActions;
