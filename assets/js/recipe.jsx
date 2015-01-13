/** @jsx React.DOM */

var React = require('react');

var getRecipe = require('./recipe_data.js').getRecipe;

function recipeStyle(photo) {
  return {backgroundImage: "url('" + photo + "')"};
}

Recipe = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var recipe_id = this.props.recipe_id;
    var recipe = getRecipe(recipe_id);

    var ingredients = recipe.Ingredients.map(function (ingredient) {
      return (
        <li key={ingredient} itemProp="ingredient" itemScope itemType="http://data-vocabulary.org/RecipeIngredient"><span itemProp="name">{ingredient}</span></li>                
      );
    });
    var directions = recipe.Directions.map(function (direction) {
      return (
        <p key={direction}>{direction}</p>
      );
    });

    var attributes = Object.keys(recipe.Attributes).map(function (attribute) {
      return (
        <div key={attribute}>
          <dt>{attribute}</dt>
          <dd>{recipe.Attributes[attribute]}</dd>
        </div>
      );
    });
        
    return (
      <article className="recipe">
        <header style={recipeStyle(recipe.Photo)}>
            <h1>{recipe.Name} <small>Recipe</small></h1>
            <img itemProp="photo" src={recipe.Photo} className="img-rounded" />
        </header>
          <p className="lead">{recipe.Description}</p>
          <div className="main">
            <section className="ingredients">
              <h1>Ingredients</h1>
              <ul className="ingredients">
                {ingredients}
              </ul>
            </section>
            <section className="directions" itemProp="instructions">
              <h1>Directions</h1>
              {directions}                   
            </section>
          </div>
          <section className="attributes">
            <dl className="attributes">
              {attributes}
            </dl>
          </section>
      </article>
    );
  }
});

module.exports = Recipe;
