import React, { useEffect, useState } from "react";
import { rtdb } from "./firebase"; // Import Firebase Realtime Database
import { get, ref as rtdbRef } from "firebase/database"; // Firebase methods for Realtime Database
import { useNavigate } from "react-router-dom";
import "./RecipeListPage.css"; // Optional styling

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recipes from Realtime Database
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipeRef = rtdbRef(rtdb, "recipes");
        const snapshot = await get(recipeRef);
        if (snapshot.exists()) {
          const recipesData = snapshot.val();
          setRecipes(Object.entries(recipesData).map(([id, data]) => ({ id, ...data })));
        } else {
          console.log("No recipes found");
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div className="recipe-list-container">
      <h1>Recipes</h1>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <button onClick={() => navigate(`/recipe/${recipe.id}`)}>View Recipe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
