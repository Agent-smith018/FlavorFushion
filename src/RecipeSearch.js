// RecipeSearch.js
import React, { useState } from "react";
import { db } from "./firebase"; // Import Firebase db instance
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore query functions
import SearchBar from "./SearchBar"; // Import the SearchBar component

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (queryText) => {
    setLoading(true);
    try {
      // Firestore query for recipes based on title, tags, and ingredients
      const titleQuery = query(
        collection(db, "recipes"),
        where("title", ">=", queryText),
        where("title", "<=", queryText + "\uf8ff")
      );

      const tagQuery = query(
        collection(db, "recipes"),
        where("tags", "array-contains", queryText)
      );

      const ingredientQuery = query(
        collection(db, "recipes"),
        where("ingredients", "array-contains", queryText)
      );

      // Execute queries concurrently
      const titleSnapshot = await getDocs(titleQuery);
      const tagSnapshot = await getDocs(tagQuery);
      const ingredientSnapshot = await getDocs(ingredientQuery);

      // Combine all the results
      const combinedResults = [
        ...titleSnapshot.docs.map((doc) => doc.data()),
        ...tagSnapshot.docs.map((doc) => doc.data()),
        ...ingredientSnapshot.docs.map((doc) => doc.data()),
      ];

      // Remove duplicates based on title
      const uniqueResults = [
        ...new Map(combinedResults.map((item) => [item.title, item])).values(),
      ];

      setRecipes(uniqueResults); // Set the recipes state with results
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Recipes</h1>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {recipes.length > 0 ? (
            <ul>
              {recipes.map((recipe, index) => (
                <li key={index}>
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <img
                    src={recipe.imageURL}
                    alt={recipe.title}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <a href={`/recipe/${recipe.id}`}>View Recipe</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recipes found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
