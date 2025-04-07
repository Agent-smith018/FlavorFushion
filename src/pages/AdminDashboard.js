// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Assuming you are using Firebase Firestore
import { collection, getDocs } from "firebase/firestore";

const AdminDashboard = () => {
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [flaggedComments, setFlaggedComments] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetching recipes count
      const recipeSnapshot = await getDocs(collection(db, "recipes"));
      setTotalRecipes(recipeSnapshot.size);

      // Fetching users count
      const userSnapshot = await getDocs(collection(db, "users"));
      setTotalUsers(userSnapshot.size);

      // Fetching flagged comments
      const commentsSnapshot = await getDocs(collection(db, "comments"));
      const flagged = commentsSnapshot.docs.filter(doc => doc.data().isFlagged).length;
      setFlaggedComments(flagged);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Recipes: {totalRecipes}</p>
      <p>Total Users: {totalUsers}</p>
      <p>Flagged Comments: {flaggedComments}</p>
    </div>
  );
};

export default AdminDashboard;
