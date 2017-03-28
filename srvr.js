const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

(function() {
    if (process.env.NODE_ENV !== 'dev') {
        return;
    }
    console.log('++' + '='.repeat(12) + '++\n||  DEV mode  ||\n++' + '='.repeat(12) + '++\n');
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.dev.config.js');
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
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
    port: 3100,
    headers: {
        'Content-Type': 'application/json'
    }
};


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended: false}));
app.all('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')) );

io.on('connect', socket => {
    //TODO userManager.router(...)
    socket.on('action', (action) => {
        httpOptions.path = path.join('/api/users', action.userId || '');
        httpOptions.headers.authorization = action.token || '';

        switch (action.type) {
            case 'server/getUser':
                httpOptions.method = 'GET';
                break;
            case 'server/authenticateUser':
                httpOptions.method = 'POST';
                break;
            case 'server/addUser':
                httpOptions.path = '/api/users';
                httpOptions.method = 'POST';
                break;
            case 'server/updateUser':
                httpOptions.method = 'PUT';
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
                let type = (action.type === 'server/authenticateUser' ? 'server/authorize' : 'server/result');
                try {
                    JSON.parse(data);
                } catch (e) {
                    type = 'server/notification';
                }
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

server.listen(port, () => {
    console.log(`Server listening on PORT: ${port}`);
});
