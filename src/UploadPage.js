import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { auth, rtdb, storage, uploadBytes, getDownloadURL } from "./firebase"; // Correct import
import { getAuth } from "firebase/auth";
import "./UploadPage.css";

const UploadPage = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    totalTime: "",
    servings: "",
    category: "",
    cuisine: "",
    image: null, // Image file selected by the user
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const user = getAuth().currentUser; // Get the current logged-in user

  // Handle text input change
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  // Handle image file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRecipe({ ...recipe, image: file });

    // Preview the image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload recipe and image to Firebase
  const handleUploadRecipe = async () => {
    const { title, description, ingredients, steps } = recipe;

    // Check if required fields are filled
    if (!title.trim() || !description.trim() || !ingredients.trim() || !steps.trim()) {
      alert("Please fill in all the required fields before uploading.");
      return;
    }

    if (!user) {
      alert("You must be logged in to upload a recipe.");
      return;
    }

    try {
      setUploading(true);
      let imageURL = null;

      // Step 1: Upload the image to Firebase Storage
      if (recipe.image) {
        // Create a reference to the storage path
        const imageRef = ref(storage, `recipes/${Date.now()}_${recipe.image.name}`);
        // Upload the image
        await uploadBytes(imageRef, recipe.image);
        // Step 2: Get the download URL of the uploaded image
        imageURL = await getDownloadURL(imageRef);
      }

      // Step 3: Prepare the recipe data
      const recipeData = {
        ...recipe,
        imageURL: imageURL || null, // Add image URL if uploaded
        userId: user.uid, // User ID of the uploader
        userName: user.displayName || "Anonymous User", // If available, otherwise "Anonymous User"
        timestamp: Date.now(), // Store the timestamp of the upload
      };

      // Remove the image file object (we don’t need to store the raw file in the database)
      delete recipeData.image;

      // Step 4: Save the recipe data to Firebase Realtime Database
      const newRecipeRef = ref(rtdb, `recipes/${Date.now()}`); // Unique reference using timestamp
      await set(newRecipeRef, recipeData); // Store the recipe data

      alert("Recipe uploaded successfully!");
      setUploading(false);
      navigate("/recipes"); // Navigate to the recipes page
    } catch (error) {
      console.error("Error uploading recipe:", error);
      alert("Error uploading recipe. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Your Recipe</h1>
      <form>
        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <textarea
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          placeholder="Ingredients"
          required
        />
        <textarea
          name="steps"
          value={recipe.steps}
          onChange={handleChange}
          placeholder="Steps"
          required
        />
        <input
          type="text"
          name="totalTime"
          value={recipe.totalTime}
          onChange={handleChange}
          placeholder="Total Time (e.g., 30 minutes)"
        />
        <input
          type="text"
          name="servings"
          value={recipe.servings}
          onChange={handleChange}
          placeholder="Servings"
        />
        <input
          type="text"
          name="category"
          value={recipe.category}
          onChange={handleChange}
          placeholder="Category (e.g., Dessert, Main Course)"
        />
        <input
          type="text"
          name="cuisine"
          value={recipe.cuisine}
          onChange={handleChange}
          placeholder="Cuisine (e.g., Italian, Indian)"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px" }} />
        )}

        <button
          type="button"
          onClick={handleUploadRecipe}
          disabled={uploading}
        >
          {uploading ? "Uploading Recipe..." : "Upload Recipe"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
