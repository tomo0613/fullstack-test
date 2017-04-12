const initialState = {
    users: [],
    signedIn: !!localStorage.getItem('jwt')
};

export default function userManagerReducer(state = initialState, action) {
    switch (action.type) {
        // case 'submitForm':
        //     return Object.assign({}, {form: action.data.form});
        case 'server/authorize':
            //TODO notification Successfully signedIn
            localStorage.setItem('jwt', JSON.parse(action.data).token);
            return Object.assign( {}, state, {signedIn: true} );
        case 'server/result':
            return Object.assign( {}, state, {users: JSON.parse(action.data)} );
        default:
            return state;
    }
}
