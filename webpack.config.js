const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'src', 'client', 'index.js'),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env', 'react'],
                plugins: ['transform-class-properties']
            }
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loader: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
    resolve: {
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src/client')
        ]
    }
};
