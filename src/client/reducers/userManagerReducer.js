const initialState = {
    users: []
};

export default function userManagerReducer(state = initialState, action) {
    switch (action.type) {
        // case 'submitForm':
        //     return Object.assign({}, {form: action.data.form});
        case 'server/authorize':
            //TODO notification
            localStorage.setItem('jwt', JSON.parse(action.data).token);
            return state;
        case 'server/result':
            return Object.assign( {}, state, {users: JSON.parse(action.data)} );
        default:
            return state;
    }
}
