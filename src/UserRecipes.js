import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import "./UserRecipes.css";

const UserRecipes = () => {
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const db = getDatabase();

    // Fetch Uploaded Recipes
    const fetchUploadedRecipes = async () => {
      const recipesRef = ref(db, "recipes");
      const snapshot = await get(recipesRef);
      if (snapshot.exists()) {
        const recipes = Object.values(snapshot.val()).filter(
          (recipe) => recipe.userId === user.uid
        );
        setUploadedRecipes(recipes);
      }
    };

    // Fetch Liked Recipes
    const fetchLikedRecipes = async () => {
      const likesRef = ref(db, `likes/${user.uid}`);
      const snapshot = await get(likesRef);
      if (snapshot.exists()) {
        const likedRecipeIds = Object.keys(snapshot.val());
        const recipesRef = ref(db, "recipes");
        const recipesSnapshot = await get(recipesRef);
        if (recipesSnapshot.exists()) {
          const recipes = Object.values(recipesSnapshot.val()).filter(
            (recipe) => likedRecipeIds.includes(recipe.id)
          );
          setLikedRecipes(recipes);
        }
      }
    };

    // Fetch Saved Recipes
    const fetchSavedRecipes = async () => {
      const savedRef = ref(db, `saved/${user.uid}`);
      const snapshot = await get(savedRef);
      if (snapshot.exists()) {
        const savedRecipeIds = Object.keys(snapshot.val());
        const recipesRef = ref(db, "recipes");
        const recipesSnapshot = await get(recipesRef);
        if (recipesSnapshot.exists()) {
          const recipes = Object.values(recipesSnapshot.val()).filter(
            (recipe) => savedRecipeIds.includes(recipe.id)
          );
          setSavedRecipes(recipes);
        }
      }
    };

    fetchUploadedRecipes();
    fetchLikedRecipes();
    fetchSavedRecipes();
  }, [user]);

  return (
    <div>
      <h2>Your Uploaded Recipes</h2>
      {uploadedRecipes.length > 0 ? (
        <ul>
          {uploadedRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      ) : (
        <p>No uploaded recipes.</p>
      )}

      <h2>Liked Recipes</h2>
      {likedRecipes.length > 0 ? (
        <ul>
          {likedRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      ) : (
        <p>No liked recipes.</p>
      )}

      <h2>Saved Recipes</h2>
      {savedRecipes.length > 0 ? (
        <ul>
          {savedRecipes.map((recipe) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      ) : (
        <p>No saved recipes.</p>
      )}
    </div>
  );
};

export default UserRecipes;
