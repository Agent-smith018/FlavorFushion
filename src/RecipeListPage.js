import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Import Firebase
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./RecipeListPage.css"; // Optional styling

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
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
            <img src={recipe.imageURL} alt={recipe.title} className="recipe-image" />
            <h3>{recipe.title}</h3>
            <p><strong>Category:</strong> {recipe.category}</p>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <button className="view-recipe-button" onClick={() => navigate(`/recipe/${recipe.id}`)}>
              View Recipe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
