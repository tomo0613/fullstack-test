import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import UserManagerForm from './components/admin/UserManagerForm.react';
import userManagerActions from './actions/userManagerActions';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.createUsersList = this.createUsersList.bind(this);
    }

    render() {
        console.log('\nrender props: ');
        console.log(this.props);
        
        return React.DOM.div(
            {},
            React.DOM.h1({}, 'Hello world!'),
            React.createElement(UserManagerForm, {
                onSubmit: userManagerActions.submitForm,
                initialValues: {method: 'getUser'}
            }),
            this.createUsersList()
        );
    }

    createUsersList() {
        const columns = ['id', 'name', 'email', 'rank', 'registration_date'];

        const createHead = () => {
            const headers = columns.map((colId, i) => {
                return React.DOM.th({
                    key: `col${i + 1}: ${colId}`
                }, colId);
            });
            return React.DOM.tr({}, headers)
        };

        const transformUserObj = (userObj, i) => {
            return columns.map((colId, j) => {
                return React.DOM.td({
                    key: `row${i + 1} col${j + 1}`
                }, userObj[colId]);
            });
        };

        const createUsersList = () => {
            if (!this.props.users || !this.props.users.length) {
                return null;
            }
            return this.props.users.map((userObj, i) => {
                return React.DOM.tr({
                    key: `row${i + 1}`
                }, transformUserObj(userObj, i));
            });
        };

        return React.DOM.table(
            {},
            React.DOM.thead({}, createHead()),
            React.DOM.tbody({}, createUsersList())
        )
    }
}

ReactDOM.render(
    React.createElement(
        Provider,
        {store: store},
        React.createElement(Main)),
        document.getElementById('mainContainer'
    )
);
