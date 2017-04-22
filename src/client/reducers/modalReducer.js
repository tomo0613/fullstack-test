const initialState = {
    currentModal: ''
};

export default function modalReducer(state = initialState, action) {
    switch (action.type) {
        case 'client/openModal':
        return Object.assign({}, state, { currentModalId: action.data });
        case 'client/closeModal':
            return Object.assign({}, state, { currentModalId: '' });
        default:
            return state;
    }
}
