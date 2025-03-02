// src/components/Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>FlavorFusion</h2>
      <ul>
        <li><button onClick={() => navigate("/home")}>Home</button></li>
        <li><button onClick={() => navigate("/upload")}>Upload Recipe</button></li>
        <li><button onClick={() => navigate("/profile")}>Profile</button></li>
        <li><button onClick={() => navigate("/recipes")}>View Recipes</button></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
