/** @jsx React.DOM */

var React = require('react');

var recipe_data = require('./recipe_data.js').data;
var recipe_id = require('./recipe_data.js').id;

function recipeStyle(photo) {
  return {backgroundImage: "url('" + photo + "')"};
}

Recipes = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var divStyle = {backgroundImage: "url('/images/tobe.jpg')"};
    var recipesStyle = {backgroundImage: "url('/images/recipes.jpg')"};
    var recipes = recipe_data.map(function (recipe) {
      return (
        <li key={recipe_id(recipe.Name)}>
          <a href={'/recipe/'+recipe_id(recipe.Name)+'/'}><div style={recipeStyle(recipe.Photo)}><h1>{recipe.Name}</h1></div></a>
        </li>
      );
    });        
    return <article className="recipes">
  <header style={recipesStyle}>
    <h1>Recipes</h1>
  </header>
  <p className="lead">Some healthy and delicious recipes.</p>
  <ul className="list-unstyled">
    {recipes}          
  </ul>  
    </article>;
  }
});

module.exports = Recipes;
