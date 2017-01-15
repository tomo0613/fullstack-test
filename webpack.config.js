const path = require('path');
const nodeExternals = require('webpack-node-externals');

console.log(path.resolve(__dirname, "./public"));

module.eports = {
    entry: path.join(__dirname, 'src', 'client', 'index.ts'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        loaders: [{
            test: /\.ts$/,
            // exclude: /node_modules/,
            loader: 'ts-loader'
        }]
    }
};
