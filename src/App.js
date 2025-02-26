import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import UploadPage from "./UploadPage";
import RecipePage from "./RecipePage";
import RecipeSearch from "./RecipeSearch"; // Import the search component
import AddRecipePage from "./AddRecipePage"; // Import AddRecipePage
import RecipeListPage from "./RecipeListPage"; // Import RecipeListPage

const App = () => {
  return (
    <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/upload" element={<UploadPage />} />
          
          {/* Dynamic Route for RecipePage with 'id' */}
          <Route path="/recipe/:id" element={<RecipePage />} />
          
          {/* Static Route for Recipe Search */}
          <Route path="/search" element={<RecipeSearch />} />
          
          {/* Static Route for AddRecipePage */}
          <Route path="/add-recipe" element={<AddRecipePage />} />
          
          {/* Static Route for Recipe List Page */}
          <Route path="/recipes" element={<RecipeListPage />} />
        </Routes>
    </div>
  );
};

export default App;
