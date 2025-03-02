import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import { FaEye, FaUserCircle } from "react-icons/fa"; // Icons for view and profile
import { auth } from "./firebase"; // Firebase import

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Fetch recipes dynamically (Replace with Firebase data fetching)
  useEffect(() => {
    const sampleRecipes = [
      { id: 1, title: "Spaghetti Carbonara", description: "A classic Italian pasta dish", category: "Main Course" },
      { id: 2, title: "Chicken Curry", description: "A spicy and flavorful chicken dish", category: "Main Course" },
      { id: 3, title: "Vegetable Stir Fry", description: "A healthy, quick meal with lots of veggies", category: "Vegetarian" },
      { id: 4, title: "Chocolate Cake", description: "A rich and delicious chocolate dessert", category: "Dessert" },
    ];
    setRecipes(sampleRecipes);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  const handleViewRecipeClick = (recipeId) => {
    if (!auth.currentUser) {
      setSelectedRecipeId(recipeId);
      setShowModal(true);
    } else {
      navigate(`/recipe/${recipeId}`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-page">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <h1>FlavorFusion</h1> {/* Website Name */}
        </div>
        <nav className="nav-links">
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <FaUserCircle className="profile-icon" onClick={() => navigate("/profile")} />
          ) : (
            <>
              <Link to="/login" className="btn login-btn">Login</Link>
              <Link to="/register" className="btn register-btn">Register</Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <h2>Welcome to FlavorFusion!</h2>
        <p>Discover and share delicious recipes with food lovers worldwide.</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <label>Filter by Category:</label>
        <select value={selectedCategory} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="All">All</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Vegetarian">Vegetarian</option>
        </select>
      </div>

      {/* Recipe List */}
      <div className="recipe-list">
        {recipes.length > 0 ? (
          recipes
            .filter(
              (recipe) =>
                (recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (selectedCategory === "All" || recipe.category === selectedCategory)
            )
            .map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <hr />
                <a href="#" className="view-recipe-link" onClick={() => handleViewRecipeClick(recipe.id)}>
                  <FaEye className="eye-icon" /> View Recipe
                </a>
              </div>
            ))
        ) : (
          <p>No recipes found. Try adjusting your search or filter.</p>
        )}
      </div>

      {/* Modal for Login */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Please log in to view the recipe details.</h2>
            <button onClick={goToLogin} className="btn login-btn">Go to Login</button>
            <button onClick={closeModal} className="btn cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="footer">
      
        <p>&copy; 2025 FlavorFusion. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
