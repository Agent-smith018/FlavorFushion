// RecipeDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { FaThumbsUp, FaCommentDots, FaShare } from "react-icons/fa";
import "./RecipeDetails.css"; // Optional styling

const RecipeDetails = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const db = getDatabase();
        const recipeRef = ref(db, `recipes/${recipeId}`);
        const snapshot = await get(recipeRef);
        if (snapshot.exists()) {
          setRecipe(snapshot.val());
        } else {
          console.log("Recipe not found");
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!recipe) return <div className="error">Recipe not found.</div>;

  return (
    <div className="recipe-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <h1>{recipe.title}</h1>
      <img
        src={recipe.imageURL || "/fallback-image.png"}
        alt={recipe.title}
        className="recipe-detail-image"
      />
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients?.map((ing, index) => (
          <li key={index}>{ing}</li>
        ))}
      </ul>
      <p><strong>Steps:</strong></p>
      <ol>
        {recipe.steps?.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <div className="recipe-detail-stats">
        <p><FaThumbsUp /> {recipe.likes || 0} Likes</p>
        <p><FaCommentDots /> {recipe.comments?.length || 0} Comments</p>
        <p><FaShare /> {recipe.shares || 0} Shares</p>
      </div>
    </div>
  );
};

export default RecipeDetails;
