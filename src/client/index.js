import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

class App extends React.Component {

	componentDidMount() {
		this.socket = io('/');
	}

	render() {
		return React.DOM.div(
			{},
			React.DOM.h1(
				{},
				'Hello world!'
			),
			React.DOM.button({
				onClick: function() {
					console.log('clicked');
					this.socket.emit('client-request', {module: 'userManager', method: 'method1', params: 'param1'});
				}.bind(this),
			}, 'gomb')
		);
	}
}

ReactDOM.render(React.createElement(App), document.getElementById('mainContainer'));
