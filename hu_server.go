package main

import (
	"flag"
	"log"
	"os"
)

var Address *string
var StaticRoot *string
var RecipesLocation *string

func main() {
	Address = flag.String("address", ":9999", "http service address")
	StaticRoot = flag.String("root", "static", "...")
	RecipesLocation = flag.String("recipes", "recipes", "location of recipes")
	flag.Parse()

	f, err := os.Open(*RecipesLocation)
	if err == nil {
		initRecipes(f)
	} else {
		log.Print(err)
	}

	ListenAndServe(*Address)
}
