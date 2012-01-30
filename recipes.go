package main

import (
	"bufio"
	"bytes"
	"fmt"
	"github.com/eikeon/hu"
	"io"
	"sort"
	"strings"
)

type Recipe struct {
	Name        string
	Description string
	Ingredients []string
	Directions  []string
	Attributes  map[string]string
	Photo       string
}

func (r *Recipe) Id() string {
	return strings.ToLower(strings.Replace(r.Name, " ", "_", -1))
}

func (r Recipe) String() string {
	buffer := bytes.NewBufferString("")
	fmt.Fprintf(buffer, "%v\n\n", r.Name)
	fmt.Fprintf(buffer, "%v\n\n", r.Description)
	for _, i := range r.Ingredients {
		fmt.Fprintf(buffer, "%v\n", i)
	}
	fmt.Fprintf(buffer, "\n")
	for _, i := range r.Directions {
		fmt.Fprintf(buffer, "%v\n\n", i)
	}
	fmt.Fprintf(buffer, "\n")
	return string(buffer.Bytes())
}

var Recipes = map[string]*Recipe{}
var Recipe_list RecipeArray

func initRecipes(reader io.Reader) {
	rune_scanner := bufio.NewReader(reader)
	expression := hu.ReadDocument(rune_scanner)
	fmt.Printf("expression: %T %v\n", expression, len(expression))
	for _, rexp := range expression {
		fmt.Printf("rexp: %v %v\n", rexp, len(rexp.(hu.Part)))
		recipe := &Recipe{}
		recipe.Name = strings.Trim(rexp.(hu.Part)[0].String(), " \n§")
		recipe.Description = rexp.(hu.Part)[1].String()
		for _, e := range rexp.(hu.Part)[2].(hu.Part) {
			ingredient := strings.Trim(e.String(), " \n")
			if ingredient != "" {
				recipe.Ingredients = append(recipe.Ingredients, ingredient)
			}
		}
		for _, e := range rexp.(hu.Part)[3].(hu.Part) {
			direction := strings.Trim(e.String(), " \n")
			if direction != "" {
				recipe.Directions = append(recipe.Directions, direction)
			}
		}
		recipe.Attributes = make(map[string]string)
		rest := rexp.(hu.Part)[4:]
		for _, e := range rest {
			parts := strings.SplitN(e.String(), ":", 2)
			if len(parts) == 2 {
				key, value := parts[0], parts[1]
				switch key {
				case "Photo":
					value = strings.TrimSpace(value)
					recipe.Photo = value
				default:
					if key != "" {
						recipe.Attributes[key] = value
					}
				}
			}
		}
		Recipes[recipe.Id()] = recipe
	}

	Recipe_list = make(RecipeArray, len(Recipes))
	var i int
	for _, r := range Recipes {
		Recipe_list[i] = r
		i += 1
	}
	sort.Sort(Recipe_list)
}

type RecipeArray []*Recipe

func (p RecipeArray) Len() int           { return len(p) }
func (p RecipeArray) Less(i, j int) bool { return p[i].Name < p[j].Name }
func (p RecipeArray) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
