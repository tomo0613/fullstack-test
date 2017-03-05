const initialState = {

};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'getForm':
            console.log('getForm: ', action.data);
            action.data.callback();
            return Object.assign({}, {form: action.data.form});
            //call refreshList
            //Error: Reducers may not dispatch actions.
        case 'response':
            console.log('response: ', action.data);
            //TODO push()
            return Object.assign({}, {message: action.data});
        case 'result':
            const users = JSON.parse(action.data)
            console.log('result: ', users);
            return Object.assign({}, {users: users});
        default:
            return state;
    }
}
