// src/RecipeDetailsPage.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'recipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecipe(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchRecipe();
  }, [id]);

  return (
    <div>
      {recipe ? (
        <>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          <p>Category: {recipe.category}</p>
          {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RecipeDetailsPage;
