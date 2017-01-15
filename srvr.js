const express = require('express');
const http = require('http');
const serveStatic = require('serve-static');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

const port = 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(serveStatic(__dirname + '/src/client')); //, {'index': ['imdex.html']}
app.use(webpackDevMiddleware(webpack(webpackConfig)));
app.use(bodyParser.urlencoded({extended: false}));

server.listen(port, function () {
    console.log('listening on *:' + port);
});
