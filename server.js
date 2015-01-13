var connect = require('connect');
var http = require('http');

var handler = require('./handler.js');

var app = connect()
    .use(require('morgan')('dev'))
    .use(require('serve-static')('public'))
    .use(handler);

http.createServer(app).listen(3000);
