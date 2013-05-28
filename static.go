package main

import (
	"net/http"
	"path"
)

func StaticHandler(w http.ResponseWriter, req *http.Request) {
	http.ServeFile(w, req, path.Join(*StaticRoot, req.URL.Path))
}
