/** @jsx React.DOM */

var React = require('react'),
    url = require('url'),
    getRecipe = require('./recipe_data.js').getRecipe,
    Home = require('./home.jsx'),
    Recipes = require('./recipes.jsx'),
    Recipe = require('./recipe.jsx'),
    Mediator = require('./mediator.jsx'),    
    App;

var NotFound = React.createClass({
  render: function() {
    return (
      <article>
        <header>
          <h1>Not Found</h1>
        </header>
        <p className="lead"></p>
      </article>
    );
  }
});

var routes = [
  {
    pattern: "^/$",
    func: function(match) {
      return {title: "Daniel Krech", type: "website",
              description: "", image: "/images/tobe.jpg",
              Content: <Home />,
              up: ""};
    }
  },
  {pattern: "/recipes/$",
   func: function(match) {
     return {title: "Recipes « Daniel Krech", type: "article",
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
       return {title: recipe.Name + " « Daniel Krech", type: "eikeonns:recipe",
               description: recipe.Description, image: recipe.Photo,
               next: '/recipe/'+recipe.next+'/', previous: '/recipe/'+recipe.previous+'/',
               Content: <Recipe recipe_id={match[1]} />, up: '/recipes/'};
     }
   }},
  {pattern: "/mediator/.*",
   func: function(match) {
     return {title: "Mediator « Daniel Krech", type: "article",
             description: "Retired (at least for now). Was: See what Medium stories people are talking about on Twitter.",
             image: "/images/colock1.jpg",
             Content: <Mediator />,
             up: '/'};
   }},
];

function getResource(path) {
  path = decodeURIComponent(path);
  var n = routes.length;
  for (var i = 0; i < n; i++) {
    var route = routes[i];
    var match = path.match(route.pattern);
    if (match !== null) {
      return route.func(match);
    }
  }
  return {
      title: "Not Found",
      type: "website",
      description: "",
      image: "/images/colock1.jpg",
      Content: <NotFound />,
      up: '/'
  };
}

App = React.createClass({
  getInitialState: function () {
    return { landscape: false, path: this.props.path};
  },
  toggleLandscape: function(event) {
    this.setState({landscape: !this.state.landscape});
  },
  push: function(path) {
    var so = {path: path};
    window.history.pushState(so, "", path);
    this.setState({path: path});
    FB.XFBML.parse();
    ga('send', 'pageview');
  },
  onClick: function(event) {
    var e = event.target;
    while (e !== undefined) {
      console.log(e);
      if (e.tagName === 'A') {
        if (url.parse(e.attributes.href.value).host === null ) {
          event.preventDefault();
          this.push(e.attributes.href.value);
          return;
        } else {
          return;
        }
      }
      e = e.parentElement;
    }
  },
  onpopstate: function(event) {
    this.setState({path: event.state.path});
  },
  componentDidMount: function() {
    window.addEventListener('click', this.onClick);
    window.onpopstate = this.onpopstate;
    window.document.onkeydown = this.handleKeyDown;
  },
  componentWillUnmount: function() {
    window.removeEventListener('click', this.onClick);
  },
  handleKeyDown: function(event) {
    if (event.keyCode == '37') {
      this.handlePrevious(event);
    }
    else if (event.keyCode == '39') {
      this.handleNext(event);
    }
  },
  getResource: function(id) {
    return getResource(id);
  },
  handleNext: function(event) {
    var resource = this.getResource(this.state.path);
    if (resource.next !== undefined) {
      this.push(resource.next);
      //this.setState({path: resource.next});
    }
  },
  handlePrevious: function(event) {
    var resource = this.getResource(this.state.path);
    if (resource.previous !== undefined) {
      this.push(resource.previous);
      //this.setState({path: resource.previous});
    }
  },
  render: function () {
    var resource = getResource(this.state.path);
    var Nav = null;
    if (resource.up) {
      Nav = <nav className="up"><h1><a href={resource.up} rel="up"><span className="glyphicon glyphicon-chevron-up"></span></a></h1></nav>;
    }
    var bodyClass = "";
    if (this.state.landscape) {
      bodyClass = "landscape";
    }
    function url(path) {
      return 'http://www.eikeon.com'+ path;
    }
    return (
      <html>
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
          <meta property="og:url" content={url(this.state.path)} />
          <meta property="og:image" content={url(resource.image)} />
          <link href="/css/site.css" rel="stylesheet" media="screen" />
        </head>
        <body className={bodyClass}>
          {Nav}
          {resource.Content}
          <aside>
            <div>
              <div className="fb-like" data-send="true" data-width="300" data-show-faces="false"></div>
              <div className="fb-comments" data-href={url(this.state.path)} data-num-posts="10" data-width="300"></div>
              <div className="fb-activity" data-site="eikeon.com" data-action="likes, recommends" data-colorscheme="light" data-header="true"></div>
            </div>
          </aside>
          <div id="fb-root"></div>        
          <script src="/js/site.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = {App: App, getResource: getResource};
  
