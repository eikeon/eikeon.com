var http = require('http'),
    send = require('send'),
    url = require('url'),
    React = require('react'),
    ReactDOMServer = require('react-dom/server');

import {getResource, App} from './app'


export default function (req, res) {
  var path = url.parse(req.url).pathname;
  var resource = getResource(path);
  function sendApp() {
    var content = ReactDOMServer.renderToString(React.createElement(App, {path: path}));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'max-age=10');
    res.end("<!DOCTYPE html>" + content);
  }
  if (resource.title !== "Not Found") {
    sendApp();
  } else {
    send(req, path, {root: './static', maxAge: 60 * 60 * 1000})
      .on('error', function(err) {
        res.statusCode = err.status || 500;
        sendApp();
      })
      .on('directory', function() {
        res.statusCode = 301;
        res.setHeader('Location', req.url + '/');
        res.end('Redirecting to ' + req.url + '/');
      })
      .pipe(res);
  }
};
