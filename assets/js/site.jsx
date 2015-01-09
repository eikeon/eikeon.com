/** @jsx React.DOM */
var React = require('react');
var App = require('./app.jsx').App;

window.jQuery = require('jquery');
require('../../bower_components/bootstrap/dist/js/bootstrap.min');

React.render(<App path={document.location.pathname} />, document);

window.fbAsyncInit = function() {
    FB.init({
        appId      : '255665227781659', // App ID
        //channelUrl : '//www.eikeon.com/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });

    // Additional initialization code here

};

// Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);
}(document));

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
