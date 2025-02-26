import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "./firebase"; // Ensure you're using the correct import path

const EditRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();  // To get the recipe ID from the URL
  const navigate = useNavigate();

  // Fetch the recipe details from Firestore
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipeRef = doc(db, "users", auth.currentUser.uid, "recipes", id);
        const docSnap = await getDoc(recipeRef);

        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          setError("Recipe not found.");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch recipe.");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const recipeRef = doc(db, "users", auth.currentUser.uid, "recipes", id);
      await updateDoc(recipeRef, {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        totalTime: recipe.totalTime,
        servings: recipe.servings,
        category: recipe.category,
        cuisine: recipe.cuisine,
        tags: recipe.tags,
        videoURL: recipe.videoURL,
        imageURL: recipe.imageURL,  // Make sure the image URL is also updated if changed
      });

      navigate(`/recipe/${id}`); // Redirect back to the recipe page after edit
    } catch (error) {
      setError("Error updating recipe.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Recipe</h1>
      {error && <div>{error}</div>}

      {recipe && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={recipe.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={recipe.description}
            onChange={handleChange}
            required
          />
          <textarea
            name="ingredients"
            placeholder="Ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
          />
          <textarea
            name="steps"
            placeholder="Steps"
            value={recipe.steps}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="totalTime"
            placeholder="Total Time"
            value={recipe.totalTime}
            onChange={handleChange}
          />
          <input
            type="number"
            name="servings"
            placeholder="Servings"
            value={recipe.servings}
            onChange={handleChange}
            required
          />
          <button type="submit">Update Recipe</button>
        </form>
      )}
    </div>
  );
};

export default EditRecipe;
