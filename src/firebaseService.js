// firebaseService.js
import { ref, get, getDatabase } from "firebase/database";
import { rtdb } from './firebase'; // Firebase initialization

// Fetch total recipes
export const fetchTotalRecipes = async () => {
  const recipeRef = ref(rtdb, "recipes");
  const recipeSnapshot = await get(recipeRef);
  const recipes = recipeSnapshot.val();
  return recipes ? Object.keys(recipes).length : 0;
};

// Fetch total users
export const fetchTotalUsers = async () => {
  const userRef = ref(rtdb, "users");
  const userSnapshot = await get(userRef);
  const users = userSnapshot.val();
  return users ? Object.keys(users).length : 0;
};

// Fetch pending recipes
export const fetchPendingRecipes = async () => {
  const recipeRef = ref(rtdb, "recipes");
  const recipeSnapshot = await get(recipeRef);
  const recipes = recipeSnapshot.val();
  return Object.values(recipes || {}).filter(recipe => recipe.status === "pending").length;
};

// Fetch active users
export const fetchActiveUsers = async () => {
  const userRef = ref(rtdb, "users");
  const userSnapshot = await get(userRef);
  const users = userSnapshot.val();
  return Object.values(users || {}).filter(user => user.isActive).length;
};
