package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/eikeon/web"
)

func main() {
	Address := flag.String("address", "localhost:9999", "http service address")
	Host := flag.String("host", "www.eikeon.com", "")
	Root := flag.String("root", ".", "...")
	RecipesLocation := flag.String("recipes", "recipes", "location of recipes")
	flag.Parse()

	if f, err := os.Open(*RecipesLocation); err == nil {
		initRecipes(f)
	} else {
		log.Print(err)
	}

	web.Root = Root

	getters := web.Getters{
		"home":    GetResource,
		"recipes": GetRecipesResource,
		"recipe":  GetRecipeResource,
		"resume":  GetResource,
	}

	if h, err := web.Handler(*Host, getters); err == nil {
		server := &http.Server{Addr: *Address, Handler: h}
		log.Println("starting server on", server.Addr)
		if err := server.ListenAndServe(); err != nil {
			log.Println(err)
		}
	} else {
		log.Println(err)
	}
}
