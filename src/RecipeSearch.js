// src/RecipeSearch.js
import React, { useState, useEffect } from "react";
import { rtdb } from "./firebase";  // Import Realtime Database
import { ref, get } from "firebase/database";  // Realtime Database methods
import './RecipeSearch.css';

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const snapshot = await get(ref(rtdb, 'recipes'));
        if (snapshot.exists()) {
          const recipesData = Object.keys(snapshot.val()).map((id) => ({
            id,
            ...snapshot.val()[id],
          }));
          setRecipes(recipesData);
        } else {
          console.log("No recipes found.");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipe-search">
      <input
        type="text"
        placeholder="Search for recipes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="recipe-list">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.imageUrl} alt={recipe.title} />
            <h3>{recipe.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;
