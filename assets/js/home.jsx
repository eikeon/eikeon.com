/** @jsx React.DOM */

var React = require('react'),
    Home;

Home = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var divStyle = {backgroundImage: "url('/images/tobe.jpg')"};
    var recipesStyle = {backgroundImage: "url('/images/recipes.jpg')"};
    return (
      <article className="home">
        <header style={divStyle}>
          <h1>Daniel Krech <small>eikeon</small></h1>
        </header>
        <p className="lead"></p>
        <ul>
          <li>
            <a href="/recipes/">
              <div style={recipesStyle}>
                <h1>Recipes</h1>
              </div>
            </a>
          </li>
        </ul>
        <ul className="see-also">
          <li>
            <a href="http://nogiushi.com/">
	      <img src="/images/brain-gears-hi.png" className="img-rounded" alt="nogiushi" />
            </a>
          </li>
          <li>
            <a href="https://medium.com/@eikeon">
	      <img src="/images/medium.png" className="img-rounded" alt="eikeon @medium" />
            </a>
          </li>
          <li>
            <a href="https://github.com/eikeon">
	      <img src="/images/gh.jpg" className="img-rounded" alt="eikeon @github"/>
            </a>
          </li>
          <li>
            <a href="https://facebook.com/eikeon">
	      <img src="/images/FB-f-Logo__blue_512.png" className="img-rounded" alt="eikeon @facebook"/>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/eikeon">
	      <img src="/images/twitter-bird-light-bgs.png" className="img-rounded" alt="eikeon @twitter"/>
            </a>
          </li>
          <li>
            <a href="https://flipboard.com/section/marvin-bRwcpK">
	      <img src="/images/flipboard.png" className="img-rounded" alt="marvin @flipboard"/>
            </a>
          </li>
        </ul>
      </article>
    );
  }
});

module.exports = Home;
