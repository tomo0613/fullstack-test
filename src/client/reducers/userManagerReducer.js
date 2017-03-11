const initialState = {
    users: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'submitForm':
            console.log('REDUCER CATCHES submitForm: ', action.data);
            // return Object.assign({}, {form: action.data.form});
        case 'server/response':
            console.log('server/response: ', action.data);
            //TODO push()
            return Object.assign({}, {message: action.data});
        case 'server/result':
            const users = JSON.parse(action.data)
            console.log('server/result: ', users);
            return Object.assign({}, state, {users: users});
        default:
            return state;
    }
}
