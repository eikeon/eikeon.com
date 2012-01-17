package hu

import (
	"fmt"
	"strings"
	"testing"
)

var ingredients = []string{
	//"6 (6-ounce) salmon fillets",
	//"salt and pepper to taste",
	//"6 (15-square inch) pieces parchment paper",
	//"1/4 cup chopped basil leaves",
	//"2 tablespoons extra virgin olive oil",
	"2 lemons, thinly sliced",
	//"kitchen twine (or tooth picks)",
	// "1 1/2 pounds small beets, trimmed and scrubbed",
	// "3 tablespoons olive oil",
	// "coarse sea salt",
	// "1 small leek, white and light green parts only, chopped",
	// "1 clove garlic, smashed",
	// "3 tablespoons chopped fresh ginger, or more to taste",
	"3 chicken broth",
	"3 cups chicken broth",
	"3 cups water",
	// "juice of 1 lemon, or to taste",
	// "1/2 (seedless) english cucumber, peeled, halved lengthwise, seeded, and chopped into 1/8-inch cubes",
	// "crème fraîche, for serving (optional)",
	"4 pounds chicken",
	"7 cups water",
	"1 large onion, halved",
	"3 stalks celery",
	// "3 carrots, cut into 2 inch pieces",
	// "1 bay leaf",
	// "1 teaspoon grated fresh ginger",
	// "salt to taste",
	// "1 1/2 tablespoons olive oil",
	// "1 cup coarsely chopped onion",
	// "1 large clove garlic, coarsely chopped",
	// "1 tablespoon coarsely grated fresh ginger",
	// "1 teaspoon ground cumin",
	// "1/2 teaspoon ground coriander",
	// "1/4 teaspoon ground cardamom",
	// "1/4 teaspoon tumeric",
	// "1/8 teaspoon crushed red pepper flakes (optional)",
	// "2 1/2 pounds sweet potatoes, peeled and sliced 1/4 inch thick",
	// "6 cups chicken broth, or as needed",
	// "salt and freshly ground black pepper",
	// "6 to 8 teaspoons fresh cheese",
	// "2 pounds carrots, sliced into thin rounds",
	// "1 tablespoon extra virgin olive oil",
	// "1 tablespoon toasted sesame oil",
	// "coarse sea salt",
	// "2 tablespoons toasted sesame seeds",
	// "2 tablespoons toasted black sesame seeds",
	// "1 pound cooked chicken, diced",
	// "3 celery stalks, diced",
	// "2 scallions, minced (use both white and green parts)",
	// "3 tablespoons parsley, minced",
	// "4 tablespoons Homemade Mayonnaise",
	// "1 1/2 teaspoons curry powder",
	// "1/4 teaspoon sea salt",
	// "freshly ground black pepper",
	// "6 small zucchini, trimmed and cut into chunks",
	// "1 large onion, thinly sliced (about 1 cup)",
	// "1 1/2 teaspoons curry powder",
	// "1/2 teaspoon ground ginger",
	// "1/2 teaspoon dry mustard",
	// "3 cups chicken broth",
	// "3 tablespoons raw rice",
	// "1 1/2 cups whole milk or heavy cream",
	// "salt and freshly ground black pepper",
	// "minced chives for garnish",
	// "6-8 baby red potatoes (more depending on # people)",
	// "salt and pepper to taste",
	// "3-4 fennel stalks (more depending on # people)",
	// "1 whole roasting chicken",
	// "2 teaspoons gray sea salt",
	// "1/4 teaspoon freshly ground black pepper",
	// "1 tablespoon olive oil",
	"1 onion, chopped",
	// "3 fennel stalks, chopped",
	// "6 garlic cloves, peeled and trimmed",
	// "1 bay leaf",
	// "2 sprigs fresh rosemary",
	// "1 teaspoon lemon juice",
	// "1 rutabaga, peeled and diced",
	// "1 celeriac, peeled and diced",
	// "4 tablespoons extra virgin olive oil",
	// "3/4 cup dried French lentils",
	// "3 cups vegetable stock",
	// "4 tablespoons lemon juice",
	// "1 large red onion, diced",
	// "4 cups thinly sliced mushrooms (about one pound)",
	// "1 tablespoon mirin",
	// "2 tablespoons fresh thyme leaves, minced",
	// "chopped fresh parsley",
	// "1 whole egg + 1 egg white",
	// "1 teaspoon prepared Dijon mustard",
	// "1 tablespoon apple cider vinegar",
	// "generous pinch of sea salt",
	// "3/4 cup olive oil",
	// "3 tablespoons olive oil, plus more for drizzling",
	// "1 large onion, chopped",
	// "2 cloves garlic, minced",
	// "1 tablespoon tomato paste",
	// "1 teaspoon ground cumin",
	// "1/2 to 1/2 teaspoon kosher salt, or more to taste",
	// "1/4 teaspoon freshly ground black pepper",
	// "large pinch of cayenne pepper, or more to taste",
	// "4 cups chicken or vegetable broth",
	// "2 cups water",
	// "1 cup red lentils, picked over and rinsed",
	// "1 large carrot, peeled and diced",
	// "juice of 1/2 lemon, or more to taste",
	// "3 tablespoons cilantro, chopped",
	// "1 cup dried arame",
	// "1 teaspoon grapeseed oil",
	// "1 red onion, cut into matchsticks",
	// "3 carrots, cut into matchsticks",
	// "1/2 small cabbage (green or Napa), thinly sliced",
	// "2 tablespoons tamari",
	// "2-3 dashes ume plum vinegar",
	// "1 tablespoon toasted sesame oil",
	// "1 garlic clove, minced",
	// "3 tablespoons chopped red onion",
	// "3 tablespoons extra virgin olive oil",
	// "2 tablespoons chopped chiles (any variety)",
	// "1/8 teaspoon chile powder",
	// "1 1/2 cups cooked black beans",
	// "1 tablespoon plus 1 teaspoon tomato paste",
	// "1/2 teaspoon salt",
	// "8 tablespoons butter",
	// "2 tablespoons mirin",
	// "2 large onion, quartered and thinly sliced",
	// "2 large tart apple, peeled, cored, finely diced",
	// "1 head of cabbage, coarsely chopped or shredded, about 8 cups",
	// "1/2 teaspoon freshly ground black pepper",
	// "5 tablespoons brown rice vinegar",
	// "1 tablespoon apple cider vinegar",
	// "salt, to taste",
	"1 large onion",
	"2 large carrots",
	// "2 fennel stocks, including a few leaves",
	// "1 bunch scallions, including half of the greens",
	// "leek trimmings: roots and leaves",
	// "1 tablespoon olive oil",
	// "8 garlic cloves, peeled and smashed",
	"8 parsley branches",
	// "6 thyme sprigs or 1/2 teaspoon dried",
	"2 bay leaves",
	"sea salt"}

func TMPTestIngredientParse(t *testing.T) {
	var productions []production
	productions = append(productions, production{left: "S", right: []string{"SS"}})

	productions = append(productions, production{left: "SS", right: []string{"Quantity", "Unit", "IP"}})
	productions = append(productions, production{left: "SS", right: []string{"Quantity", "IP"}})
	productions = append(productions, production{left: "SS", right: []string{"IP"}})
	//productions = append(productions, production{left: "SS", right: []string{"Quantity", "Noun", "Noun"}})
	//productions = append(productions, production{left: "SS", right: []string{"Quantity", "Noun", "Verb"}})

	productions = append(productions, production{left: "Unit", right: []string{"Noun"}})

	productions = append(productions, production{left: "IP", right: []string{"Ingredient"}})
	productions = append(productions, production{left: "IP", right: []string{"Ingredient", "Comma", "AP"}})

	productions = append(productions, production{left: "Ingredient", right: []string{"NP"}})

	//productions = append(productions, production{left: "NP", right: []string{"Noun"}})
	productions = append(productions, production{left: "NP", right: []string{"Adjective", "Noun"}})
	productions = append(productions, production{left: "NP", right: []string{"Noun", "Noun"}})

	//productions = append(productions, production{left: "NP", right: []string{"D", "N"}})

	productions = append(productions, production{left: "AP", right: []string{"Adverb", "Verb"}})
	productions = append(productions, production{left: "AP", right: []string{"Verb"}})

	ingredients = ingredients[2:3]
	for _, ingredient := range ingredients {
		fmt.Printf("Parsing '%v'\n", ingredient)

		p := NewParser(strings.NewReader(ingredient))
		p.productions = productions
		p.parse()
		fmt.Println()
	}
}

func TmpTestParse(t *testing.T) {
	var productions []production
	productions = append(productions, production{left: "S", right: []string{"NP", "VP"}})
	productions = append(productions, production{left: "NP", right: []string{"D", "N"}})
	productions = append(productions, production{left: "N", right: []string{"N", "PP"}})
	productions = append(productions, production{left: "VP", right: []string{"VP", "PP"}})
	productions = append(productions, production{left: "VP", right: []string{"V", "NP"}})
	productions = append(productions, production{left: "PP", right: []string{"P", "NP"}})
	productions = append(productions, production{left: "N", right: []string{"man"}})
	productions = append(productions, production{left: "N", right: []string{"girl"}})
	productions = append(productions, production{left: "N", right: []string{"telescope"}})
	productions = append(productions, production{left: "D", right: []string{"the"}})
	productions = append(productions, production{left: "NP", right: []string{"John"}})
	productions = append(productions, production{left: "NP", right: []string{"Mary"}})
	productions = append(productions, production{left: "P", right: []string{"with"}})
	productions = append(productions, production{left: "V", right: []string{"saw"}})

	//var input = []string{"Mary saw the man"}
	var input = []string{"the girl saw the man"}

	for _, ingredient := range input {
		fmt.Printf("Parsing '%v'\n", ingredient)

		p := NewParser(strings.NewReader(ingredient))
		p.productions = productions
		r := p.parse()
		if len(r) > 0 {
			fmt.Printf("  %v\n", r)
		}
		fmt.Println()
	}
}
