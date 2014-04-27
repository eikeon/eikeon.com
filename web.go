package main

import (
	"flag"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"

	"github.com/edsu/mediator/medium"
	"github.com/eikeon/web"
)

type RecipesData struct {
	*web.Resource
	Recipes map[string]*Recipe
}

type RecipeData struct {
	*web.Resource
	Recipe *Recipe
}

type Story struct {
	*web.Resource
	Story *medium.Story
}

func (s *Story) Tweets() (tweets []template.HTML) {
	seen := map[string]bool{}
	for _, t := range s.Story.Tweets() {
		v := t.HTML
		if v == "" {
			v = t.Text
		}
		if seen[v] == false {
			seen[v] = true
			tweets = append(tweets, template.HTML(v))
		}
	}
	return
}

var R = regexp.MustCompile(".*/(?P<id>[^/]+)/")

func GetData(r *web.Resource) web.TemplateData {
	if r.Name == "recipes" {
		return &RecipesData{Resource: r, Recipes: Recipes}
	} else if r.Name == "recipe" {
		id := R.ReplaceAllString(r.URL, "${id}")
		log.Println("ID:", id)
		if recipe, rok := Recipes[id]; rok {
			return &RecipeData{Resource: r, Recipe: recipe}
		}
		return nil
	} else if r.Name == "story" {
		su := strings.Replace(r.URL, "//www.eikeon.com/mediator/", "https://medium.com/", 1)
		su = su[0 : len(su)-1]
		if ss, err := medium.GetStory(su); err == nil {
			return &Story{Resource: r, Story: &ss}
		} else {
			return nil
		}
	} else {
		return r
	}
}

func addStoryResource(mention medium.Mention) {
	u, err := url.Parse(mention.Story.Url)
	if err != nil {
		return
	}
	dr := &web.Resource{URL: "//www.eikeon.com/mediator" + u.Path + "/",
		Title:       mention.Story.Title,
		Description: mention.Story.Description,
		Photo:       mention.Story.ImageUrl,
		Name:        "story",
		Up:          "/mediator/"}
	web.Put(dr)

}

func main() {
	Address := flag.String("address", ":9999", "http service address")
	Root := flag.String("root", "/usr/local/share", "...")
	RecipesLocation := flag.String("recipes", "recipes", "location of recipes")
	Static := flag.Bool("static", false, "serve static files")
	Add := flag.Bool("add", false, "add resources in resources.json")
	flag.Parse()

	if f, err := os.Open(*RecipesLocation); err == nil {
		initRecipes(f)
		for _, recipe := range Recipes {
			dr := &web.Resource{URL: "//www.eikeon.com/recipe/" + recipe.Id() + "/",
				Title:       recipe.Name + " Recipe",
				Description: recipe.Description,
				Photo:       recipe.Photo,
				Name:        "recipe",
				Type:        "eikeonns:recipe",
				Up:          "/recipes/"}
			web.Put(dr)
		}
	} else {
		log.Print(err)
	}

	h := web.NewHub()

	go func() {
		for mention := range medium.Tweets() {
			h.In <- map[string]interface{}{"Tweet": mention.Tweet, "Story": mention.Story, "Count": mention.Count}
			addStoryResource(mention)
		}
	}()

	http.Handle("/messages", h.Handler())

	rh := &web.ResourceHandler{Root: http.Dir(*Root), Static: *Static, Aliases: map[string]string{"dev.eikeon.com": "www.eikeon.com", "dev.nogiushi.com": "nogiushi.com"}, GetData: GetData}
	if *Add {
		//addResources(*Root)
		rh.Init("eikeon-static", "www.eikeon.com")
	}
	http.Handle("/", rh)

	server := &http.Server{Addr: *Address}
	log.Println("starting server on", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Println(err)
	}
}
