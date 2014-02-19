package main

import (
	"bytes"
	"crypto/md5"
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"path"
	"regexp"
	"strings"
)

var pages map[string]struct {
	Name        string
	Title       string
	Description string
	Photo       string
}

var site *template.Template
var templates = make(map[string]*template.Template)

var PERM = regexp.MustCompile("[0-9a-f]{8}~")

func CanonicalHostHandler(w http.ResponseWriter, req *http.Request) {
	var canonical = "www.eikeon.com"
	if req.Host != canonical {
		http.Redirect(w, req, "http://"+canonical+req.URL.Path, http.StatusMovedPermanently)
	} else {
		http.Error(w, "", http.StatusInternalServerError)
	}
}

func getTemplate(name string) *template.Template {
	if t, ok := templates[name]; ok {
		return t
	} else {
		if site == nil {
			site = template.Must(template.ParseFiles(path.Join(*Root, "templates/site.html")))
		}
		t, err := site.Clone()
		if err != nil {
			log.Fatal("cloning site: ", err)
		}
		t = template.Must(t.ParseFiles(path.Join(*Root, "templates/"+name+".html")))
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

func ListenAndServe(address string) {
	if j, err := os.OpenFile(path.Join(*Root, "pages.json"), os.O_RDONLY, 0666); err == nil {
		dec := json.NewDecoder(j)
		if err = dec.Decode(&pages); err != nil {
			log.Println("WARNING: could not decode pages.json", err)
		}
		j.Close()
	} else {
		log.Println("WARNING: could not open pages.json", err)
	}

	static := http.Dir(path.Join(*Root, "static/"))

	http.Handle("eikeon.com/", http.HandlerFunc(CanonicalHostHandler))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		d := templateData{"Recipes": Recipes}
		t := getTemplate("404")

		if page, ok := pages[r.URL.Path]; ok {
			t = getTemplate(page.Name)
			d["Title"] = page.Title
			d["Description"] = page.Description
			d["Photo"] = page.Photo
		} else if r.URL.Path == "/recipes" {
			http.Redirect(w, r, r.URL.Path+"/", http.StatusMovedPermanently)
		} else if strings.HasPrefix(r.URL.Path, "/recipe/") {
			var recipe = Recipes[path.Base(r.URL.Path)]
			if recipe == nil {
				w.Header().Set("Cache-Control", "max-age=10, must-revalidate")
				w.WriteHeader(http.StatusNotFound)
			} else {
				t = getTemplate("recipe")
				d["Recipe"] = recipe
				d["Title"] = recipe.Name
				d["Type"] = "eikeonns:recipe"
				d["Description"] = recipe.Description
				if r.URL.Path[len(r.URL.Path)-1] != '/' {
					http.Redirect(w, r, r.URL.Path+"/", http.StatusMovedPermanently)
					return
				}
				d["Path"] = r.URL.Path
				d["Photo"] = recipe.Photo
			}
		} else {
			upath := r.URL.Path
			if !strings.HasPrefix(upath, "/") {
				upath = "/" + upath
				r.URL.Path = upath
			}
			f, err := static.Open(path.Clean(upath))
			if err == nil {
				defer f.Close()
				d, err1 := f.Stat()
				if err1 != nil {
					http.Error(w, "could not stat file", http.StatusInternalServerError)
					return
				}
				url := r.URL.Path
				if d.IsDir() {
					if url[len(url)-1] != '/' {
						http.Redirect(w, r, url+"/", http.StatusMovedPermanently)
						return
					}
				} else {
					if url[len(url)-1] == '/' {
						http.Redirect(w, r, url[0:len(url)-1], http.StatusMovedPermanently)
						return
					}
				}
				if d.IsDir() {
					w.WriteHeader(http.StatusNotFound)
				} else {
					if PERM.MatchString(path.Base(url)) {
						ttl := int64(365 * 86400)
						w.Header().Set("Cache-Control", fmt.Sprintf("max-age=%d", ttl))
					}
					http.ServeContent(w, r, d.Name(), d.ModTime(), f)
					return
				}
			} else {
				w.WriteHeader(http.StatusNotFound)
			}
		}
		d["Path"] = r.URL.Path
		writeTemplate(t, d, w)
	})

	err := http.ListenAndServe(address, nil)
	if err != nil {
		log.Print("ListenAndServe:", err)
	}
}

var Address *string
var Root *string
var RecipesLocation *string

func main() {
	Address = flag.String("address", ":9999", "http service address")
	Root = flag.String("root", ".", "...")
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
