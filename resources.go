package main

import (
	"log"

	"github.com/eikeon/web"
)

type Resource struct {
	Route *web.Route
	site  *Site
}

func (r *Resource) Site() *Site {
	return r.site
}

func (r *Resource) Path() string {
	return r.Route.Path
}

func (r *Resource) Title() string {
	return r.Route.Data["Title"]
}

func (r *Resource) Type() string {
	return r.Route.Data["Type"]
}

func (r *Resource) Description() string {
	return r.Route.Data["Description"]
}

func (r *Resource) Photo() string {
	return r.Route.Data["Photo"]
}

func (r *Resource) Up() string {
	return r.Route.Data["Up"]
}

type RecipesResource struct {
	Resource
	Recipes map[string]*Recipe
}

type RecipeResource struct {
	Resource
	Recipe *Recipe
}

func (r *RecipeResource) Path() string {
	return "/recipe/" + r.Recipe.Id() + "/" // TODO: use Route reverse
}

func (r *RecipeResource) Title() string {
	return r.Recipe.Name + " Recipe"
}

func (r *RecipeResource) Description() string {
	return r.Recipe.Description
}

func (r *RecipeResource) Photo() string {
	return r.Recipe.Photo
}

type Site struct {
	Name  string
	Host_ string `json:"Host"`
	// Static Host root: E.g. http://static.eikeon.com
	Static  string
	Routes_ []*web.Route `json:"Routes"`
}

func (s *Site) Host() string {
	return s.Host_
}

func (s *Site) Routes() []*web.Route {
	return s.Routes_
}

func (s *Site) GetResource(name string, route *web.Route, vars web.Vars) web.Resource {
	switch name {
	case "home":
		return &Resource{Route: route, site: s}
	case "resume":
		return &Resource{Route: route, site: s}
	case "mediator":
		return &Resource{Route: route, site: s}
	case "recipes":
		return &RecipesResource{Resource: Resource{Route: route, site: s}, Recipes: Recipes}
	case "recipe":
		if id, ok := vars["id"]; ok {
			if recipe, rok := Recipes[id]; rok {
				return &RecipeResource{Resource: Resource{Route: route, site: s}, Recipe: recipe}
			}
		}
		return nil
	default:
		log.Printf("Warning: unexpected name '%s'\n", route.Name)
		return nil
	}
}
