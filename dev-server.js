'use strict';
const path = require('path');
const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');
const webpack = require('webpack');

// Switch to Dev Mode
const config = require('./webpack.config');
config.entry.app.unshift('webpack-hot-middleware/client');
config.output.publicPath = '/public/dist/';
config.plugins.pop(); // Don't Compress
config.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()); // HMR

// Start Dev Server
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo    : true,
}));

app.use(require('webpack-hot-middleware')(compiler));

// Proxy
const proxyContext = [
    '/auth',
    '/timeline',
    '/actions',
    '/upload',
    '/share',
    '/public/img/icon-sprites.svg',
    '/public/dist/emotions_v2.min.json',
];
const proxyOpts = {
    target: 'http://localhost:8080',
};
app.use(proxyMiddleware(proxyContext, proxyOpts));

app.get('*', (req, res) => {
    console.log(req.path);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', err => {
    if (err) console.log(err);

    console.log('Listening at http://localhost:3000');
});
