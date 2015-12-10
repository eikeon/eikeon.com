/** @jsx React.DOM */
var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app.jsx').App;

window.jQuery = require('jquery');
require('../../bower_components/bootstrap/dist/js/bootstrap.min');

ReactDOM.render(<App path={document.location.pathname} />, document);

window.fbAsyncInit = function() {
  FB.init({
    appId      : '255665227781659', // App ID
    xfbml      : true,
    version    : 'v2.5'
  });
    // Additional initialization code here
};

// Load the SDK Asynchronously
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function(i,s,o,g,r,a,m){
  i.GoogleAnalyticsObject=r;
  i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments);
  };
  i[r].l=1*new Date();
  a=s.createElement(o);
  m=s.getElementsByTagName(o)[0];
  a.async=1;a.src=g;
  m.parentNode.insertBefore(a,m);
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-48999518-1', 'eikeon.com');
ga('send', 'pageview');
