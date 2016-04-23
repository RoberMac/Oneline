'use strict';
const fs = require('fs');
const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');
const webpack = require('webpack');


// Start Dev Server
const app = express();
const config = require('./webpack.config.dev.js');
const compiler = webpack(config);

// Middlewares
app
.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo    : true,
}))
.use(require('webpack-hot-middleware')(compiler))
.use(proxyMiddleware([
    '/auth',
    '/timeline',
    '/actions',
    '/upload',
    '/share',
    '/public/img/icon-sprites.svg',
    '/public/dist/emotions_v2.min.json',
], {
    target: 'http://localhost:8080',
}));

// Template engines
app
.set('views', './views')
.set('view engine', 'jade');

// Route
app.get('*', (req, res) => {
    console.log(req.path);
    const assets = JSON.parse(
        fs.readFileSync(`${__dirname}/public/dist/assets.manifest.dev.json`, 'UTF-8')
    );
    res.render('index', { assets });
});

app.listen(3000, 'localhost', err => {
    if (err) console.log(err);

    console.log('Listening at http://localhost:3000');
});
