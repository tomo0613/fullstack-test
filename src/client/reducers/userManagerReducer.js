const initialState = {
    users: [],
    signedIn: !!localStorage.getItem('jwt'),
    signedAs: localStorage.getItem('role') || 'user'
};

export default function userManagerReducer(state = initialState, action) {
    switch (action.type) {
        case 'authenticateUser':
            if (!action.data) {
                return state;
            }
            localStorage.setItem('jwt', action.data.token);
            localStorage.setItem('role', action.data.role);
            return Object.assign( {}, state, {signedIn: true, signedAs: action.data.role} );
        case 'getUser':
            if (!action.data) {
                return state;
            }
            return Object.assign( {}, state, {users: action.data} );
        case 'client/signOut':
            return Object.assign( {}, state, {signedIn: false} );
        case 'server/signUp':
            console.log('signUp store');
            return state;
        default:
            return state;
    }
}
