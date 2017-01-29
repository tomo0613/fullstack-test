const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const services = {
    userManager: require(path.join(__dirname, 'src', 'server', 'services', 'userManagerAPI.js'))
};

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended: false}));

io.on('connect', socket => {
    socket.on('client-request', data => {
        console.log('client-request', data);
        // TODO
    });
});

app.set('port', (process.env.PORT || 3000))

server.listen(app.get('port'), () => {
    console.log('listening on *:' + app.get('port'));
});
