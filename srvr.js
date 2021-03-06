const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

(() => {
    if (process.env.NODE_ENV !== 'dev') {
        return;
    }
    console.log('\x1b[40m+' + '-'.repeat(12) + '+\n|  \x1b[32mDEV mode\x1b[37m  |\n+' + '-'.repeat(12) + '+\n\x1b[0m');
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
        httpOptions.headers.authorization = action.token || '';

        //httpOptions = userManager.router(action, httpOptions);
        httpOptions.path = path.join('/api/users', action.userId || '');

        switch (action.type) {
            case 'server/getUser':
                httpOptions.method = 'GET';
                break;
            case 'server/addUser':
                httpOptions.path = '/api/users';
            case 'server/authenticateUser':
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
            res.on('data', (data) => {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log('-- error >:( --', e);//TODO
                }
                socket.emit('action', {
                    type: action.type.split('/')[1],
                    data: data.data,
                    notification: data.message
                });
            });
        });

        if (httpOptions.method === 'POST' || httpOptions.method === 'PUT') {
            let postData = action.postData;
            postData = (postData && Object.keys(postData).length ? JSON.stringify(postData) : '');
            request.write(postData);
        }
        request.end();
    });
});

server.listen(port, () => {
    console.log(`Server listening on PORT: ${port}`);
});
