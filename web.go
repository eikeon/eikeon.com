package main

import (
	"bytes"
	"crypto/md5"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"path"
)

var site = template.Must(template.ParseFiles("templates/site.html"))

func makeTemplate(names ...string) *template.Template {
	t, err := site.Clone()
	if err != nil {
		log.Fatal("cloning site: ", err)
	}
	return template.Must(t.ParseFiles(names...))
}

type View interface {
	Prefix() string
	Name() string
	Match(req *http.Request) bool
	Data(req *http.Request) Data
}

type Data map[string]interface{}

type view struct {
	prefix, name string
	data         Data
}

func (v *view) Prefix() string {
	return v.prefix
}

func (v *view) Name() string {
	return v.name
}

func (v *view) Match(req *http.Request) bool {
	return req.URL.Path == v.Prefix()
}

func (v *view) Data(req *http.Request) Data {
	if v.data == nil {
		v.data = make(Data)
	}
	v.data["Title"] = v.Name()
	return v.data
}

func add(view View) {
	t := makeTemplate("templates/" + view.Name() + ".html")
	http.HandleFunc(view.Prefix(), func(w http.ResponseWriter, req *http.Request) {
		var d Data
		if view.Match(req) {
			d = view.Data(req)
		} else {
			//w.Header().Set("Cache-Control", "max-age=10, must-revalidate")
			//w.WriteHeader(http.StatusNotFound)
			StaticHandler(w, req)
			return
		}
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
	})
}

func ListenAndServe(address string) {
	add(&view{prefix: "/", name: "home", data: Data{"Recipes": Recipes}})
	add(&view{prefix: "/resume/", name: "resume", data: Data{}})
	add(&view{prefix: "/recipes/", name: "recipes", data: Data{"Recipes": Recipes}})

	t := makeTemplate("templates/" + "recipe" + ".html")
	http.HandleFunc("/recipe/", func(w http.ResponseWriter, req *http.Request) {

		var r = Recipes[path.Base(req.URL.Path)]
		if r == nil {
			w.Header().Set("Cache-Control", "max-age=10, must-revalidate")
			w.WriteHeader(http.StatusNotFound)
			//return
		} else {
			if req.URL.Path[len(req.URL.Path)-1] != '/' {
				http.Redirect(w, req, req.URL.Path+"/", http.StatusMovedPermanently)
				return
			}
		}
		// setCacheControl(w, req)
		// page := newPage(r.Name + " Recipe")
		// page.Recipe = r
		// page.Write(w, req)

		var d Data = Data{"Recipe": r}
		// if view.Match(req) {
		// 	d = view.Data(req)
		// } else {
		// }
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
	})

	// add(&view{prefix: "/transition/", name: "transition", data: Data{"Recipes": Recipes}})
	http.HandleFunc("/bootstrap/", StaticHandler)
	http.HandleFunc("/jquery/", StaticHandler)
	err := http.ListenAndServe(address, nil)
	if err != nil {
		log.Print("ListenAndServe:", err)
	}
}
