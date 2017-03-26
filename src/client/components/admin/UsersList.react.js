import React from 'react';
import { connect } from 'react-redux';

class UsersList extends React.Component {
    render() {
        const columns = ['id', 'name', 'email', 'role', 'registration_date'];

        const createTableHead = () => {
            const headers = columns.map((colId, i) => {
                return React.DOM.th({
                    key: `col${i + 1}: ${colId}`
                }, colId);
            });
            return React.DOM.tr({}, headers);
        };

        const userDataToTableRow = (userObj, i) => {
            return columns.map((colId, j) => {
                return React.DOM.td({
                    key: `row${i + 1} col${j + 1}`
                }, userObj[colId]);
            });
        };

        const createTableBody = () => {
            if (!this.props.users || !this.props.users.length) {
                return null;
            }
            return this.props.users.map((userObj, i) => {
                return React.DOM.tr({
                    key: `row${i + 1}`
                }, userDataToTableRow(userObj, i));
            });
        };

        return React.DOM.table(
            {},
            React.DOM.thead({}, createTableHead()),
            React.DOM.tbody({}, createTableBody())
        );
    }
}

UsersList = connect(
    (state, props) => {
        return {users: state.userManager.users};
    }
)(UsersList);

export default UsersList;
