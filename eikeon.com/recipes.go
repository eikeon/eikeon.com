package main

import (
	"os"
	"log"
	"bufio"
	"sort"
	"hu"
)

var Recipes = map[string]*hu.Recipe{}
var Recipe_list RecipeArray

func init() {
	f, err := os.Open("recipes")
	if err != nil {
		log.Print("open", err)
		return
	}
	reader := bufio.NewReader(f)
	for {
		input, err := reader.ReadString('\f')

		tmpl, err2 := hu.New("").Parse(input)
		if err2 == nil {
			var recipe = tmpl.Recipe
			Recipes[recipe.Id()] = recipe
			//log.Println("Parsed:", recipe.Name)
			//log.Println("  attributes:", recipe.Attributes)
		} else {
			//log.Print(tmpl.lex)
			//log.Print("line:", line + tmpl.lex.lineNumber())
			log.Print("err:", err2)
			log.Println("of\n", input)
			//continue
		}

		if err != nil {
			break
		}
	}

	Recipe_list = make(RecipeArray, len(Recipes))
	var i int
	for _, r := range Recipes {
		Recipe_list[i] = r
		i += 1
	}
	sort.Sort(Recipe_list)
}

type RecipeArray []*hu.Recipe

func (p RecipeArray) Len() int           { return len(p) }
func (p RecipeArray) Less(i, j int) bool { return p[i].Name < p[j].Name }
func (p RecipeArray) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
