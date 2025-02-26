import React, { useState } from "react";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({ recipe, onAddToMealPlanner }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  return (
    <div className="recipe-card">
      {/* Floating Interaction Icons */}
      <div className="recipe-interactions">
        <FaHeart
          className="interaction-icon like-badge"
          onClick={() => setLikes(likes + 1)}
        />
        <FaComment
          className="interaction-icon comment-badge"
          onClick={() => setComments(comments + 1)}
        />
      </div>

      <h3>{recipe.title}</h3>
      <p>{recipe.description}</p>
      <p><strong>Category:</strong> {recipe.category}</p>

      {/* Action Badges */}
      <div className="recipe-actions">
        <span className="action-badge like-badge" onClick={() => setLikes(likes + 1)}>
          <FaHeart /> {likes} Likes
        </span>
        <span className="action-badge comment-badge" onClick={() => setComments(comments + 1)}>
          <FaComment /> {comments} Comments
        </span>
        <span className="action-badge view-badge" onClick={() => navigate(`/recipe/${recipe.id}`)}>
          <FaEye /> View Details
        </span>
      </div>

      {/* Add to Meal Planner Button */}
      <button onClick={() => onAddToMealPlanner(recipe)}>
        Add to Meal Planner
      </button>
    </div>
  );
};

export default RecipeCard;
