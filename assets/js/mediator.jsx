/** @jsx React.DOM */

var React = require('react');

function mediatorStyle(photo) {
    return {backgroundImage: "url('" + photo + "')"};
}

Mediator = React.createClass({
    getInitialState: function () {
      return {};
    },
    render: function () {
      var mediatorStyle = {backgroundImage: "url('/images/colock1.jpg')"};
      return (
        <article className="mediator">
          <header style={mediatorStyle}>
            <h1>Mediator</h1>
          </header>
          <p className="lead">Retired.</p>
        </article>
      );
    }
});

module.exports = Mediator;


