const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
//TODO use JsonWebTokens

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
        httpOptions.path = path.join('/api/users', action.userId || '');

        switch (action.type) {
            case 'server/getUser':
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
                httpOptions.method = 'PUT';
                httpOptions.headers = {
                    'Content-Type': 'application/json'
                };
                break;
            case 'server/deleteUser':
                httpOptions.method = 'DELETE';
                break;
            default:
                return;
        }

        const request = http.request(httpOptions, res => {
            res.setEncoding('utf8');
            res.on('data', data => {
                const type = (httpOptions.method === 'GET' ? 'server/result' : 'server/notification');
                socket.emit('action', {type: type, data: data});
            });
        });

        if (httpOptions.method === 'POST' || httpOptions.method === 'PUT') {
            let postData = action.userData;
            postData = (postData && Object.keys(postData).length ? JSON.stringify(postData) : '');
            request.write(postData);
        }
        request.end();
    });
});

app.set('port', (process.env.PORT || 3000));

server.listen(app.get('port'), () => {
    console.log('Server listening on PORT:' + app.get('port'));
});
