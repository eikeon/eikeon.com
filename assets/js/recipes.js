var React = require('react');

var recipe_data = require('./recipe_data.js').data;
var recipe_id = require('./recipe_data.js').id;

function recipeStyle(photo) {
  return {backgroundImage: "url('" + photo + "')"};
}

var Recipes = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var recipesStyle = {backgroundImage: "url('/images/recipes.jpg')"};
    var recipes = recipe_data.map(function (recipe) {
      return (
        <li key={recipe_id(recipe.Name)}>
          <a href={'/recipe/'+recipe_id(recipe.Name)+'/'}>
            <div style={recipeStyle(recipe.Photo)}>
              <h1>{recipe.Name}</h1>
            </div>
          </a>
        </li>
      );
    });
    return (
      <article className="recipes">
        <header style={recipesStyle}>
          <h1>Recipes</h1>
        </header>

	<blockquote>
          <p>Good cooking is an art, as well as a form of intense pleasure…. A recipe is only a theme, which an intelligent cook can play each time with a variation.</p>
          <cite><a href="http://en.wikipedia.org/wiki/Jehane_Benoît">Madame Jehane Benoît</a></cite>
        </blockquote>

        <ul className="list-unstyled">
          {recipes}
        </ul>
      </article>
    );
  }
});

export default Recipes
