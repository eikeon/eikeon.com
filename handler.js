require('node-jsx').install({extension: '.jsx'});

var http = require('http'),
    send = require('send'),
    url = require('url'),
    React = require('react'),
    app = require('./assets/js/app.jsx');

var MILLISECONDS = 1000;

exports = module.exports = function (req, res) {
  var path = url.parse(req.url).pathname;
  var resource = app.getResource(path);
  function sendApp() {
    var content = React.renderToString(React.createElement(app.App, {path: path}));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'max-age=10');
    res.end("<!DOCTYPE html>" + content);
  }
  if (resource.title !== "Not Found") {
    sendApp();
  } else {
    send(req, path, {root: './static', maxAge: 60 * 60 * MILLISECONDS})
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
