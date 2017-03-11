const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

(function() {
    if (process.env.NODE_ENV !== 'dev') {
        return;
    }
    console.log('--- DEV mode ---');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.dev.config.js');
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath//noInfo
    }));
    app.use(require('webpack-hot-middleware')(compiler, {
        log: console.log
    }));
})();

const services = {
    userManager: require(path.join(__dirname, 'src', 'server', 'services', 'userManagerAPI.js'))
};

const httpOptions = {
    host: 'localhost',
    port: 3100
};

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended: false}));

io.on('connect', socket => {
    socket.on('action', (action) => {
        let userId = action.data[0] || '';
        userId = (userId ? '?user_id=' + userId : userId);

        switch (action.type) {
            case 'server/getUser':
                httpOptions.path = '/api/users' + userId;
                httpOptions.method = 'GET';
                break;
            case 'server/addUser':
                httpOptions.path = '/api/users';
                httpOptions.method = 'POST';
                httpOptions.headers = {
                    'Content-Type': 'application/json'
                };
                break;
            case 'server/updateUser':
                httpOptions.path = '/api/users' + userId;
                httpOptions.method = 'PUT';
                httpOptions.headers = {
                    'Content-Type': 'application/json'
                };
                break;
            case 'server/deleteUser':
                httpOptions.path = '/api/users' + userId;
                httpOptions.method = 'DELETE';
                break;
            default:
                return;
        }

        const request = http.request(httpOptions, res => {
            res.setEncoding('utf8');
            res.on('data', data => {
                console.log('on -> data: ', data);
                const type = (httpOptions.method === 'GET' ? 'server/result' : 'server/response');
                socket.emit('action', {type: type, data: data});
            });
        });

        if (httpOptions.method === 'POST' || httpOptions.method === 'PUT') {
            let postData = args.params[1];
            postData = (postData && Object.keys(postData).length ? JSON.stringify(postData) : null);
            request.write(postData);
        }
        request.end();
    });
});

app.set('port', (process.env.PORT || 3000))

server.listen(app.get('port'), () => {
    console.log('Server listening on PORT:' + app.get('port'));
});
