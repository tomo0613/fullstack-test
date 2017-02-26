import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
			requestMethod: 'getUser',
			userId: null,
			form: {}
        };
        this.updateUsers = this.updateUsers.bind(this);
		this.createSubmitButton = this.createSubmitButton.bind(this);
		this.createUsersList = this.createUsersList.bind(this);
		this.createMethodSelectInput = this.createMethodSelectInput.bind(this);
		this.createParamsForm = this.createParamsForm.bind(this);
		this.getForm = this.getForm.bind(this);
    }

    componentDidMount() {
        this.socket = io('/');
        this.socket.on('getUserRes', this.updateUsers);
    }

    render() {
        // console.log(this.state);
        return React.DOM.div(
			{},
			React.DOM.h1({}, 'Hello world!'),
			this.createMethodSelectInput(),
			this.createParamsForm(),
			this.createSubmitButton(),
			this.createUsersList()
		);
    }

	createSubmitButton() {
		return React.DOM.button({
			onClick: () => {
				this.socket.emit('client-request', {method: this.state.requestMethod, params: this.getForm()});
			}
		}, 'submit');
	}

	createUsersList() {
		const columns = ['id', 'name', 'email', 'rank', 'registration_date'];

		const createHead = () => {
			const headers = columns.map((colId, i) => {
				return React.DOM.th({key: `col${i+1}: ${colId}`}, colId);
			});
			return React.DOM.tr({}, headers)
		};

		const transformUserObj = (userObj, i) => {
			return columns.map((colId, j) => {
				return React.DOM.td({key: `row${i+1} col${j+1}`}, userObj[colId]);
			});
		};

		const createUsersList = () => {
			if (!this.state.users.length) {
				return null;
			}
			return this.state.users.map((userObj, i) => {
				return React.DOM.tr({key: `row${i+1}`}, transformUserObj(userObj, i));
			});
		};

		return React.DOM.table(
			{},
			React.DOM.thead({}, createHead()),
			React.DOM.tbody({}, createUsersList())
		)
	}

    createMethodSelectInput() {
        return React.DOM.select(
			{
				value: this.state.requestMethod,
				onChange: (e) => {
					this.setState({requestMethod: e.target.value});
				}
			},
			React.DOM.option({value: 'getUser'}, 'getUser'),
			React.DOM.option({value: 'addUser'}, 'addUser'),
			React.DOM.option({value: 'updateUser'}, 'updateUser'),
			React.DOM.option({value: 'deleteUser'}, 'deleteUser')
		);
   	}

	createParamsForm() {
		// const createFormInput = (inputId) => {
		// 	return React.DOM.input({
		// 		placeholder: inputId,
		// 		onBlur: (e) => {
		// 			const newForm = {};
		// 			if (this.state.form[inputId]) {
		// 				newForm[inputId] = this.state.form[inputId];
		// 			}
		// 			if (e.target.value) {//
		// 				newForm.email = e.target.value;
		// 			}
		// 			this.setState({
		// 				form: newForm
		// 			});
		// 		}
		// 	});
		// };

		return React.DOM.div(
			{},
			React.DOM.input({
				disabled: this.props.requestMethod === 'addUser',
				placeholder: 'userId',
				onBlur: (e) => {
					this.setState({
						userId: e.target.value
					});
				}
			}),
			'name: ',
			React.DOM.input({
				placeholder: 'name',
				onBlur: (e) => {
					let newForm = {};
					if (this.state.form.email) {
						newForm.email = this.state.form.email;
					}
					if (e.target.value) {
						newForm.name = e.target.value;
					}
					this.setState({
						form: newForm
					});
				}
			}),
			'email: ',
			React.DOM.input({
				placeholder: 'email',
				onBlur: (e) => {
					let newForm = {};
					if (this.state.form.name) {
						newForm.name = this.state.form.name;
					}
					if (e.target.value) {
						newForm.email = e.target.value;
					}
					this.setState({
						form: newForm
					});
				}
			})
		);
	}

	getForm() {
		return [this.state.userId, this.state.form];
	}

	getUser(userId) {
		this.socket.emit('client-request', {method: 'getUser', params: []});
	}

    updateUsers(users) {
        this.setState({users: JSON.parse(users)});
    }
}

ReactDOM.render(React.createElement(App), document.getElementById('mainContainer'));
