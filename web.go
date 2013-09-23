package main

import (
	"bytes"
	"crypto/md5"
	"encoding/json"
	"fmt"
	"go/build"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"path"
)

var pkg struct {
	Version string `json:"version"`
}
var Root string
var site *template.Template
var templates = make(map[string]*template.Template)

func init() {
	if p, err := build.Default.Import("github.com/eikeon/eikeon.com", "", build.FindOnly); err == nil {
		Root = p.Dir
	} else {
		log.Println("WARNING: could not import package:", err)
	}

	if j, err := os.OpenFile(path.Join(Root, "bower.json"), os.O_RDONLY, 0666); err == nil {
		dec := json.NewDecoder(j)
		if err = dec.Decode(&pkg); err != nil {
			log.Println("WARNING: could not decode bower.json", err)
		}
		j.Close()
	} else {
		log.Println("WARNING: could not open bower.json", err)
	}

}

type longExpireHandler struct {
	h http.Handler
}

func longExpire(h http.Handler) http.Handler {
	return &longExpireHandler{h}
}

func (le *longExpireHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ttl := int64(86400)
	w.Header().Set("Cache-Control", fmt.Sprintf("max-age=%d", ttl))
	le.h.ServeHTTP(w, r)
}

func getTemplate(name string) *template.Template {
	if t, ok := templates[name]; ok {
		return t
	} else {
		if site == nil {
			site = template.Must(template.ParseFiles(path.Join(Root, "templates/site.html")))
		}
		t, err := site.Clone()
		if err != nil {
			log.Fatal("cloning site: ", err)
		}
		t = template.Must(t.ParseFiles(path.Join(Root, name)))
		templates[name] = t
		return t
	}
}

type templateData map[string]interface{}

func writeTemplate(t *template.Template, d templateData, w http.ResponseWriter) {
	var bw bytes.Buffer
	h := md5.New()
	mw := io.MultiWriter(&bw, h)
	err := t.ExecuteTemplate(mw, "html", d)
	if err == nil {
		w.Header().Set("ETag", fmt.Sprintf(`"%x"`, h.Sum(nil)))
		w.Header().Set("Content-Length", fmt.Sprintf("%d", bw.Len()))
		w.Write(bw.Bytes())
	} else {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func handleTemplate(prefix, name string, data templateData) {
	t := getTemplate("templates/" + name + ".html")
	http.HandleFunc(prefix, func(w http.ResponseWriter, req *http.Request) {
		d := templateData{}
		d["Title"] = name
		d["Version"] = pkg.Version
		if data != nil {
			for k, v := range data {
				d[k] = v
			}
		}
		if req.URL.Path == prefix {
			d["Found"] = true
		} else {
			w.Header().Set("Cache-Control", "max-age=10, must-revalidate")
			w.WriteHeader(http.StatusNotFound)
		}
		writeTemplate(t, d, w)
	})
}

func ListenAndServe(address string) {
	fs := longExpire(http.FileServer(http.Dir(path.Join(Root, "static/"))))
	http.Handle("/"+pkg.Version+"/", fs)

	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		if req.URL.Path == "/" {
			d := templateData{"Version": pkg.Version, "Recipes": Recipes}
			t := getTemplate("templates/" + "home" + ".html")
			writeTemplate(t, d, w)
		} else {
			fs.ServeHTTP(w, req)
			return
		}
	})

	handleTemplate("/resume/", "resume", templateData{})
	handleTemplate("/recipes/", "recipes", templateData{"Recipes": Recipes})

	t := getTemplate("templates/" + "recipe" + ".html")
	http.HandleFunc("/recipe/", func(w http.ResponseWriter, req *http.Request) {
		d := templateData{"Version": pkg.Version}
		var r = Recipes[path.Base(req.URL.Path)]
		if r == nil {
			d["Found"] = false
			w.Header().Set("Cache-Control", "max-age=10, must-revalidate")
			w.WriteHeader(http.StatusNotFound)
			//return
		} else {
			d["Recipe"] = r
			d["Found"] = true
			if req.URL.Path[len(req.URL.Path)-1] != '/' {
				http.Redirect(w, req, req.URL.Path+"/", http.StatusMovedPermanently)
				return
			}
		}
		writeTemplate(t, d, w)
	})

	err := http.ListenAndServe(address, nil)
	if err != nil {
		log.Print("ListenAndServe:", err)
	}
}
