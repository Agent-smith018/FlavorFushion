import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaRegCircle, FaShareAlt, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
import "./ShoppingList.css";

// Predefined categories for ingredients (you can modify or expand this)
const ingredientCategories = {
  fruits: ["apple", "banana", "orange", "grape", "mango"],
  vegetables: ["carrot", "potato", "broccoli", "spinach", "tomato"],
  dairy: ["milk", "cheese", "butter", "yogurt"],
  meats: ["chicken", "beef", "pork", "fish"],
  grains: ["rice", "pasta", "bread", "oats"],
  spices: ["salt", "pepper", "garlic", "cumin", "paprika"]
};

const ShoppingList = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupedIngredients, setGroupedIngredients] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [savedLists, setSavedLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const recipesRef = ref(db, "recipes");

    const fetchRecipes = async () => {
      try {
        const snapshot = await get(recipesRef);
        if (snapshot.exists()) {
          const recipesData = Object.entries(snapshot.val()).map(([id, recipe]) => ({
            id,
            ...recipe,
          }));
          setRecipes(recipesData);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeSelect = (recipeId) => {
    const selected = recipes.find((recipe) => recipe.id === recipeId);
    if (selected && Array.isArray(selected.ingredients)) {
      setSelectedRecipe(selected);
      generateShoppingList(selected);
    } else {
      console.error("Invalid recipe selected:", selected);
    }
  };

  const generateShoppingList = (recipe) => {
    if (recipe && Array.isArray(recipe.ingredients)) {
      const ingredientsSet = new Set();
      recipe.ingredients.forEach((ingredient) => ingredientsSet.add(ingredient));
      setShoppingList(Array.from(ingredientsSet));
      categorizeIngredients(Array.from(ingredientsSet));
    } else {
      console.error("Ingredients data is not an array:", recipe.ingredients);
    }
  };

  const categorizeIngredients = (ingredients) => {
    const grouped = {};
    ingredients.forEach((ingredient) => {
      let categoryFound = false;
      for (const category in ingredientCategories) {
        if (ingredientCategories[category].includes(ingredient.toLowerCase())) {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(ingredient);
          categoryFound = true;
          break;
        }
      }
      if (!categoryFound) {
        if (!grouped["others"]) {
          grouped["others"] = [];
        }
        grouped["others"].push(ingredient);
      }
    });
    setGroupedIngredients(grouped);
  };

  const handleCheckItem = (ingredient) => {
    const updatedCheckedItems = new Set(checkedItems);
    if (checkedItems.has(ingredient)) {
      updatedCheckedItems.delete(ingredient);
    } else {
      updatedCheckedItems.add(ingredient);
    }
    setCheckedItems(updatedCheckedItems);
  };

  const handleClearList = () => {
    setShoppingList([]);
    setCheckedItems(new Set());
    setSelectedRecipe(null);
  };

  const handleSaveList = () => {
    if (selectedRecipe) {
      const listToSave = {
        recipe: selectedRecipe.title,
        ingredients: shoppingList,
        checkedItems: Array.from(checkedItems),
      };
      setSavedLists([...savedLists, listToSave]);

      // Save to localStorage for offline access
      const savedListsData = JSON.parse(localStorage.getItem('savedLists')) || [];
      savedListsData.push(listToSave);
      localStorage.setItem('savedLists', JSON.stringify(savedListsData));

      alert("Shopping List Saved for Offline Access!");
    }
  };

  const handleShareList = () => {
    const listString = shoppingList.join(", ");
    const shareText = `Check out my shopping list for the recipe: ${selectedRecipe?.title}. Ingredients: ${listString}`;
    navigator.share({
      title: "Shopping List",
      text: shareText,
      url: window.location.href,
    }).catch((error) => console.error("Error sharing:", error));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredShoppingList = shoppingList.filter((ingredient) =>
    ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleCategory = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDownloadPDF = () => {
    if (!selectedRecipe) return;

    const doc = new jsPDF();
    const title = `Shopping List for ${selectedRecipe.title}`;
    const ingredients = shoppingList.join("\n");

    // Add title
    doc.setFontSize(18);
    doc.text(title, 10, 10);

    // Add ingredients
    doc.setFontSize(12);
    doc.text("Ingredients:", 10, 20);
    doc.text(ingredients, 10, 30);

    // Add checked items
    if (checkedItems.size > 0) {
      doc.text("\nChecked Items:", 10, 40);
      doc.text(Array.from(checkedItems).join("\n"), 10, 50);
    }

    // Save PDF
    doc.save("shopping-list.pdf");
  };

  return (
    <div className="shopping-list">
      <h2>Generated Shopping List</h2>

      <div className="recipe-selection">
        <h3>Select a Recipe</h3>
        <select onChange={(e) => handleRecipeSelect(e.target.value)} value={selectedRecipe ? selectedRecipe.id : ""}>
          <option value="">-- Select a Recipe --</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.title}
            </option>
          ))}
        </select>
      </div>

      {selectedRecipe && (
        <div className="selected-recipe">
          <h4>Recipe: {selectedRecipe.title}</h4>
          <p>{selectedRecipe.description}</p>
          {selectedRecipe.image && (
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-image" />
          )}
          <h5>Ingredients:</h5>
          <ul>
            {selectedRecipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="shopping-list-container">
        {Object.keys(groupedIngredients).map((category) => (
          <div key={category} className="ingredient-category">
            <div className="category-header" onClick={() => handleToggleCategory(category)}>
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <span>
                {collapsedCategories[category] ? <FaArrowDown /> : <FaArrowUp />}
              </span>
            </div>
            {collapsedCategories[category] === false && (
              <ul>
                {groupedIngredients[category].map((ingredient, index) => (
                  <li key={index}>
                    <span
                      onClick={() => handleCheckItem(ingredient)}
                      className={`ingredient ${checkedItems.has(ingredient) ? "checked" : ""}`}
                    >
                      {checkedItems.has(ingredient) ? <FaCheckCircle /> : <FaRegCircle />} {ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {filteredShoppingList.length > 0 && (
          <div>
            <h3>Filtered Shopping List:</h3>
            <ul>
              {filteredShoppingList.map((ingredient, index) => (
                <li key={index}>
                  <span
                    onClick={() => handleCheckItem(ingredient)}
                    className={`ingredient ${checkedItems.has(ingredient) ? "checked" : ""}`}
                  >
                    {checkedItems.has(ingredient) ? <FaCheckCircle /> : <FaRegCircle />} {ingredient}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="actions">
        <button onClick={handleSaveList} className="save-btn">Save Shopping List</button>
        <button onClick={handleShareList} className="share-btn"><FaShareAlt /> Share List</button>
        <button onClick={handleDownloadPDF} className="download-btn">Download Shopping List (PDF)</button>
      </div>

      {shoppingList.length > 0 && (
        <div className="clear-button-container">
          <button onClick={handleClearList} className="clear-btn">Clear Shopping List</button>
        </div>
      )}

      <div className="footer">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;
