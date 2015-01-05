/** @jsx React.DOM */

var React = require('react'),
    //    $     = require('jquery'),
    getRecipe = require('./recipe_data.js').getRecipe,
    Home = require('./home.js'),
    Recipes = require('./recipes.js'),
    Recipe = require('./recipe.js'),
    Mediator = require('./mediator.js'),    
    App;

var NotFound = React.createClass({
  render: function() {
    return <article>
  <header>
    <h1>Not Found</h1>
  </header>
  <p className="lead"></p>
</article>
  }
})

App = React.createClass({
    getInitialState: function () {
        return { landscape: false};
    },
    toggleLandscape: function(event) {
        this.setState({landscape: !this.state.landscape});
    },
    componentDidMount: function () {
    },
    render: function () {
        var resource = {
            title: "Not Found",
            type: "website",
            description: "",
            image: "/images/colock1.jpg",
            Content: <NotFound />,
            up: '/'
        };
        var routes = [
            {
                pattern: "^/$",
                func: function(match) {
                    resource = {title: "Daniel Krech", type: "website",
                                description: "", image: "/images/tobe.jpg",
                                Content: <Home />,
                                up: ""};
                }
            },
            {pattern: "/recipes/$",
             func: function(match) {
                 resource = {title: "Recipes « Daniel Krech", type: "article",
                             description: "Some healthy and delicious recipes.",
                             image: "/images/recipes.jpg",                 
                             Content: <Recipes />,
                             up: '/'};
             }
            },                      
            {pattern: /\/recipe\/([^/]+)\/$/,
             func: function(match) {
                 var recipe = getRecipe(match[1]);
                 if (recipe) {
                     resource = {title: recipe.Name + " « Daniel Krech", type: "eikeonns:recipe",
                                 description: recipe.Description, image: recipe.Photo,
                                 Content: <Recipe recipe_id={match[1]} />, up: '/recipes/'};
                 }
             }},
            {pattern: "/mediator/.*",
             func: function(match) {
                 resource = {title: "Mediator « Daniel Krech", type: "article",
                             description: "Retired (at least for now). Was: See what Medium stories people are talking about on Twitter.",
                             image: "/images/colock1.jpg",
                             Content: <Mediator />,
                             up: '/'};
            }},                      
            
        ];
        var path = this.props.path;
        routes.map(function (route) {
            var match = path.match(route.pattern)            
            if (match !== null) {
                route.func(match);
            }
        });
        var Nav = null;
        if (resource.up) {
            Nav = <nav className="up"><h1><a href={resource.up} rel="up"><span className="glyphicon glyphicon-chevron-up"></span></a></h1></nav>
        }
        var bodyClass = "";
        if (this.state.landscape) {
            bodyClass = "landscape";
        }
        function url(path) {
            return 'http://www.eikeon.com'+ path
        }
        return <html>
  <head data-prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# eikeonns: http://ogp.me/ns/apps/eikeonns#">
    <title>Daniel Krech</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content={resource.title} />
    <meta property="og:site_name" content="eikeon.com"/>
    <meta property="og:locale" content="en_US"/>
    <meta property="fb:app_id" content="255665227781659" />
    <meta property="fb:admins" content="756782588"/>
    <meta property="og:type" content={resource.type} />
    <meta property="og:description" content={resource.description} />
    <meta property="og:url" content={url(this.props.path)} />            
    <meta property="og:image" content={url(resource.image)} />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
  </head>
  <body className="loading">
    {Nav}
    {resource.Content}
    <aside>
      <div>
        <div className="fb-like" data-send="true" data-width="300" data-show-faces="false"></div>
        <div className="fb-activity" data-site="eikeon.com" data-action="likes, recommends" data-colorscheme="light" data-header="true"></div>        
        <div className="fb-comments" data-href={url(this.props.path)} data-num-posts="10" data-width="300"></div>
      </div>
    </aside>
    <div id="fb-root"></div>        
    <script src="/js/eikeon.js"></script>        
  </body>
</html>

    }
});

module.exports = App;