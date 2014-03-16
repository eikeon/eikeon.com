package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/edsu/mediator/medium"
	"github.com/eikeon/web"
)

func main() {
	Address := flag.String("address", ":9999", "http service address")
	Root := flag.String("root", ".", "...")
	RecipesLocation := flag.String("recipes", "recipes", "location of recipes")
	flag.Parse()

	if f, err := os.Open(*RecipesLocation); err == nil {
		initRecipes(f)
	} else {
		log.Print(err)
	}

	web.Root = Root

	h := web.NewHub()
	go func() {
		for mention := range medium.Tweets() {
			h.In <- web.Message{"Tweet": mention.Tweet, "Story": mention.Story, "Count": mention.Count}
		}
	}()
	http.Handle("/messages", h.Handler())

	var s Site
	if h, err := web.Handler(&s); err == nil {
		http.Handle("/", h)
		server := &http.Server{Addr: *Address}
		log.Println("starting server on", server.Addr)
		if err := server.ListenAndServe(); err != nil {
			log.Println(err)
		}
	} else {
		log.Println(err)
	}
}
