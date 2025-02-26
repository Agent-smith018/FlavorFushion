import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db, storage, auth } from "./firebase";// Make sure you're using the correct import path

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Handle Delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const recipeRef = doc(db, "users", auth.currentUser.uid, "recipes", id);
        await deleteDoc(recipeRef);
        navigate("/home"); // Redirect to home page after deletion
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  return (
    <div>
      <h1>Recipe Details</h1>
      {/* Display recipe details */}
      <button onClick={handleDelete}>Delete Recipe</button>
    </div>
  );
};

export default RecipePage;
