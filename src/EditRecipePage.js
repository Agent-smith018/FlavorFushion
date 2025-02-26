import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRecipe(docSnap.data());
          setImagePreview(docSnap.data().imageURL);
        } else {
          console.error("Recipe not found!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageURL = recipe.imageURL;

      if (newImage) {
        const imageRef = ref(storage, `recipes/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        imageURL = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, "recipes", id), { ...recipe, imageURL });
      alert("Recipe updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div>
      <h1>Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={recipe?.title || ""} onChange={handleChange} required />
        <textarea name="description" value={recipe?.description || ""} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" width="100" />}
        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
};

export default EditRecipePage;
