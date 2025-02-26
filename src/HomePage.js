import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import './HomePage.css';
import { FaSearch } from "react-icons/fa";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [mealPlanner, setMealPlanner] = useState([]);  // New state for meal planner
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sample static data (replace with actual API call later)
  const sampleRecipes = [
    { id: 1, title: 'Spaghetti Carbonara', description: 'A classic Italian pasta dish', category: 'Main Course' },
    { id: 2, title: 'Chicken Curry', description: 'A spicy and flavorful chicken dish', category: 'Main Course' },
    { id: 3, title: 'Vegetable Stir Fry', description: 'A healthy, quick meal with lots of veggies', category: 'Vegetarian' },
    { id: 4, title: 'Chocolate Cake', description: 'A rich and delicious chocolate dessert', category: 'Dessert' }
  ];

  useEffect(() => {
    setRecipes(sampleRecipes);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    (recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === "All" || recipe.category === selectedCategory)
  );

  const handleAddToMealPlanner = (recipe) => {
    setMealPlanner((prevMealPlanner) => [...prevMealPlanner, recipe]);
  };

  const handleRemoveFromMealPlanner = (recipeId) => {
    setMealPlanner((prevMealPlanner) => prevMealPlanner.filter(r => r.id !== recipeId));
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <header className="header">
        <div className="logo-container">
          <h1>FlavorFusion</h1>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login"><button className="btn login-btn">Login</button></Link>
          <Link to="/register"><button className="btn register-btn">Register</button></Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <h2>Welcome to Our Recipe Sharing Platform!</h2>
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
        <FaSearch className="search-icon" />
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
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onAddToMealPlanner={handleAddToMealPlanner}
          />
        ))}
      </div>

      {/* Meal Planner */}
      <div className="meal-planner">
        <h3>My Meal Planner</h3>
        {mealPlanner.length === 0 ? (
          <p>No recipes added to meal planner yet.</p>
        ) : (
          <div className="meal-planner-list">
            {mealPlanner.map((recipe) => (
              <div key={recipe.id} className="meal-planner-item">
                <p>{recipe.title}</p>
                <button onClick={() => handleRemoveFromMealPlanner(recipe.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-menu">
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </div>
        <p>&copy; 2025 Recipe Sharing Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
