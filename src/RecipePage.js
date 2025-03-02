// src/RecipePage.js
import React, { useEffect, useState } from "react";
import { rtdb } from "./firebase"; // Import Realtime Database
import { ref, get, remove } from "firebase/database"; // Import necessary Realtime Database functions
import { useParams, useNavigate } from "react-router-dom";
import "./RecipePage.css"; // Optional styling

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get recipe ID from URL
  const navigate = useNavigate();

  // Fetch recipe from Realtime Database by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = ref(rtdb, "recipes/" + id);
        const snapshot = await get(recipeRef);
        if (snapshot.exists()) {
          setRecipe(snapshot.val());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle recipe deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      const recipeRef = ref(rtdb, 'recipes/' + id); // Use Realtime Database reference
      await remove(recipeRef); // Remove recipe from Realtime Database
      alert("Recipe deleted successfully!");
      navigate("/recipes"); // Redirect to Recipe List Page after deletion
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found!</p>;

  return (
    <div className="recipe-page-container">
      <h1>{recipe.title}</h1>
      <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Created At:</strong> {recipe.createdAt}</p>
      {/* Add the rest of the recipe fields here */}
      <div className="recipe-actions">
        <button className="edit-button" onClick={() => navigate(`/edit-recipe/${id}`)}>
          Edit Recipe
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Delete Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipePage;
