import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import UploadPage from "./UploadPage";
import RecipePage from "./RecipePage";
import RecipeSearch from "./RecipeSearch";
import AddRecipePage from "./AddRecipePage";
import RecipeListPage from "./RecipeListPage";
import Dashboard from "./Dashboard"; // Import Dashboard component
import "./App.css";

const App = () => {
  return (
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/search" element={<RecipeSearch />} />
          <Route path="/add-recipe" element={<AddRecipePage />} />
          <Route path="/recipes" element={<RecipeListPage />} />
          <Route path="/dashboard" element={<Dashboard />} />  {/* Added Dashboard Route */}
        </Routes>
      </div>
  );
};

export default App;
