package main

import (
	"github.com/eikeon/web"
)

type Resource struct {
	Route *web.Route
}

func GetResource(route *web.Route, vars web.Vars) web.Resource {
	return &Resource{Route: route}
}

func (r *Resource) Path() string {
	return r.Route.Data["Path"]
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

type RecipesResource struct {
	Resource
	Recipes map[string]*Recipe
}

func GetRecipesResource(r *web.Route, vars web.Vars) web.Resource {
	return &RecipesResource{Resource: Resource{Route: r}, Recipes: Recipes}
}

type RecipeResource struct {
	Resource
	Recipe *Recipe
}

func (rr *RecipeResource) Title() string {
	return rr.Recipe.Name
}

func (rr *RecipeResource) Description() string {
	return rr.Recipe.Description
}

func (rr *RecipeResource) Photo() string {
	return rr.Recipe.Photo
}

func GetRecipeResource(r *web.Route, vars web.Vars) web.Resource {
	if id, ok := vars["id"]; ok {
		if recipe, rok := Recipes[id]; rok {
			return &RecipeResource{Resource: Resource{Route: r}, Recipe: recipe}
		}
	}
	return nil
}
