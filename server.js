'use strict';

var express = require('express');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var config = require('./webpack.config');
var CONF = require('./config');

var app = express();

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: {
        colors: true
    }
}));

app.use(express.static(CONF.BASE_PATH));

app.listen(8000, () => {
    console.info('Server listening on http://localhost:8000, Ctrl+C to stop');
});
