import React, { useState } from "react";
import { db, storage } from "./firebase"; // Firebase services
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css"; // Optional styling

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
    tags: "",
    videoURL: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  // Handle input change for text fields
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRecipe({ ...recipe, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!recipe.title || !recipe.description || !recipe.ingredients || !recipe.steps || !recipe.servings || !recipe.category || !recipe.cuisine) {
      return "All fields except video URL and tags are required.";
    }
    if (recipe.servings <= 0) {
      return "Servings must be a positive number.";
    }
    return "";
  };

  // Handle form submission for upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Reset success message before submitting
    setUploading(true);
    console.log("Form submitted!");

    // Validate form fields
    const validationError = validateForm();
    if (validationError) {
      console.log("Validation error:", validationError);
      setError(validationError);
      setUploading(false);
      return;
    }

    try {
      let imageURL = "";

      // If a new image is selected, upload it to Firebase Storage
      if (recipe.image) {
        const imageRef = ref(storage, `recipes/${recipe.image.name}`);
        await uploadBytes(imageRef, recipe.image);
        imageURL = await getDownloadURL(imageRef); // Get the image URL after upload
      } else {
        imageURL = imagePreview; // Use existing image URL if no new image is uploaded
      }

      // Prepare the recipe data object
      const recipeData = {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients.split(",").map((item) => item.trim()), // Split ingredients by commas
        steps: recipe.steps.split(".").map((item) => item.trim()), // Split steps by periods
        totalTime: recipe.totalTime,
        servings: Number(recipe.servings),
        category: recipe.category,
        cuisine: recipe.cuisine,
        tags: recipe.tags.split(",").map((item) => item.trim()), // Split tags by commas
        videoURL: recipe.videoURL,
        imageURL: imageURL, // Store the uploaded image URL
        dateAdded: Timestamp.now(), // Store the current timestamp
      };

      // Upload the recipe data to Firestore
      await addDoc(collection(db, "recipes"), recipeData); // Add the recipe to the "recipes" collection

      // Clear form and reset state
      setRecipe({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        totalTime: "",
        servings: "",
        category: "",
        cuisine: "",
        tags: "",
        videoURL: "",
        image: null,
      });

      setImagePreview(null);
      setUploading(false);
      setSuccessMessage("Recipe uploaded successfully!"); // Set success message

      // Delay the navigation to Recipe List Page
      setTimeout(() => {
        navigate("/"); // Redirect to homepage or recipe listing page after a short delay
      }, 1500); // Delay navigation by 1.5 seconds
    } catch (error) {
      console.error("Error uploading recipe:", error);
      setError("Error uploading recipe.");
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Your Recipe</h1>

      {/* Display error or success messages */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Recipe Upload Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Recipe Title"
          onChange={handleChange}
          value={recipe.title}
          required
          disabled={uploading}
        />
        <textarea
          name="description"
          placeholder="Short Description"
          onChange={handleChange}
          value={recipe.description}
          required
          disabled={uploading}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          onChange={handleChange}
          value={recipe.ingredients}
          required
          disabled={uploading}
        />
        <textarea
          name="steps"
          placeholder="Steps (separated by periods)"
          onChange={handleChange}
          value={recipe.steps}
          required
          disabled={uploading}
        />
        <input
          type="text"
          name="totalTime"
          placeholder="Total Time"
          onChange={handleChange}
          value={recipe.totalTime}
          disabled={uploading}
        />
        <input
          type="number"
          name="servings"
          placeholder="Servings"
          onChange={handleChange}
          value={recipe.servings}
          required
          disabled={uploading}
        />
        <select
          name="category"
          onChange={handleChange}
          value={recipe.category}
          required
          disabled={uploading}
        >
          <option value="">Select Category</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
        </select>
        <select
          name="cuisine"
          onChange={handleChange}
          value={recipe.cuisine}
          required
          disabled={uploading}
        >
          <option value="">Select Cuisine</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
        </select>
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          onChange={handleChange}
          value={recipe.tags}
          disabled={uploading}
        />
        <input
          type="text"
          name="videoURL"
          placeholder="Video URL (optional)"
          onChange={handleChange}
          value={recipe.videoURL}
          disabled={uploading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Recipe"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
