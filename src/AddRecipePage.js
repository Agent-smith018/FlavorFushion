// src/AddRecipePage.js
import React, { useState } from 'react';
import { rtdb, storage } from './firebase';  // Import Realtime Database and Storage
import { ref, set } from 'firebase/database';  // Realtime Database functions
import { ref as storageRef, uploadBytes } from 'firebase/storage';  // Storage functions
import './AddRecipePage.css';

const AddRecipePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle recipe form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image to Firebase Storage if there's an image
      if (image) {
        const imageRef = storageRef(storage, `recipes/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await snapshot.ref.getDownloadURL();
      }

      // Save recipe data to Realtime Database
      const recipeId = Date.now().toString(); // Simple ID based on timestamp
      await set(ref(rtdb, 'recipes/' + recipeId), {
        title,
        description,
        category,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      setTitle('');
      setDescription('');
      setCategory('');
      setImage(null);
      setLoading(false);
      alert('Recipe added successfully!');
    } catch (err) {
      console.error('Error adding recipe:', err);
      setLoading(false);
      alert('Error adding recipe!');
    }
  };

  return (
    <div className="add-recipe-page">
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipePage;
