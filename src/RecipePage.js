import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Firebase services
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./RecipePage.css"; // Optional styling

const RecipePage = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get recipe ID from URL
  const navigate = useNavigate();

  // Fetch recipe from Firestore by ID
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
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
      await deleteDoc(doc(db, "recipes", id)); // Delete recipe from Firestore
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
      <img src={recipe.imageURL} alt={recipe.title} className="recipe-image" />
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>
      <p><strong>Total Time:</strong> {recipe.totalTime} minutes</p>
      <h3>Description</h3>
      <p>{recipe.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Steps</h3>
      <ol>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {recipe.videoURL && (
        <div>
          <h3>Watch the Video</h3>
          <a href={recipe.videoURL} target="_blank" rel="noopener noreferrer">
            {recipe.videoURL}
          </a>
        </div>
      )}

      {/* Edit and Delete Buttons */}
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
