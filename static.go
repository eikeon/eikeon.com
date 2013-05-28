package main

import (
	"fmt"
	"net/http"
	"path"
	"time"
)

func StaticHandler(w http.ResponseWriter, req *http.Request) {
	now := time.Now()
	d := time.Date(2011, 4, 11, 0, 0, 0, 0, time.Local)
	TTL := int64(86400)
	ttl := TTL - (now.Unix()-d.Unix())%TTL // shift
	w.Header().Set("Cache-Control", fmt.Sprintf("max-age=%d", ttl))

	http.ServeFile(w, req, path.Join(*StaticRoot, req.URL.Path))
}
