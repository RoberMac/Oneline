'use strict';
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// Switch to Dev Mode
let config = require('./webpack.config');
config.entry.app.unshift('webpack-dev-server/client?http://localhost:3000', 'webpack/hot/dev-server')
config.output.publicPath = '/public/dist/'
config.module.loaders[0].loaders.unshift('react-hot') // react-hot-loader
config.plugins.pop() // Don't Compress
config.plugins.push(new webpack.HotModuleReplacementPlugin()) // HMR

// Start Dev Server
const compiler = webpack(config);
new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: [{
        path: /\/(auth|timeline|actions|upload)/,
        target: 'http://localhost:8080'
    }],
    // noInfo: true,
    stats: { colors: true },
}).listen(3000, 'localhost', (err, result) => {
    if (err) { console.log(err) }

    console.log('Listening at localhost:3000');
})