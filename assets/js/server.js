var connect = require('connect');
var http = require('http');

//var handler = require('./handler');
import handler from './handler'

var app = connect()
    .use(require('morgan')('dev'))
    .use(handler);

http.createServer(app).listen(3000);
