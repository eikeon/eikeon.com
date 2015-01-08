require('node-jsx').install({extension: '.jsx'});

var http = require('http'),
    send = require('send'),
    url = require('url'),
    React = require('react'),
    App = require('./assets/js/app.jsx');

exports = module.exports = function (req, res) {
    if (false && (req.url == '/' || req.url == '/marvin/')) {
        //res.setHeader('Content-Type', 'text/html');
        //var children = {"1": React.createElement(Home, {})};
        //res.end("<!DOCTYPE html>" + React.renderToStaticMarkup(React.createElement(App, {}, children)));
    } else {
        send(req, url.parse(req.url).pathname, {root: './static'})
            .on('error', function(err) {
                var path = url.parse(req.url).pathname
                var content = React.renderToString(React.createElement(App, {path: path}));
                res.end("<!DOCTYPE html>" + content);
                
                //res.statusCode = err.status || 500;
                //res.setHeader('Content-Type', 'text/html');
                //res.end("<!DOCTYPE html>" + React.renderToStaticMarkup(React.createElement(App, {})));
                res.end(err.message);
            })
            .on('directory', function() {
                res.statusCode = 301;
                res.setHeader('Location', req.url + '/');
                res.end('Redirecting to ' + req.url + '/');
            })
            .pipe(res);
    }
};
