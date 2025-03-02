import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { FaThumbsUp, FaCommentDots } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';  // Import the user icon
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) {
        navigate("/login"); // Redirect if not logged in
        return;
      }

      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${auth.currentUser.uid}`);
        const userSnapshot = await get(userRef);
        setUserData(userSnapshot.val());

        // Fetch user's recipes
        const recipesRef = ref(db, "recipes");
        const recipesSnapshot = await get(recipesRef);
        const userRecipesList = [];
        recipesSnapshot.forEach((childSnapshot) => {
          const recipe = childSnapshot.val();
          if (recipe.userId === auth.currentUser.uid) {
            userRecipesList.push(recipe);
          }
        });
        setUserRecipes(userRecipesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth.currentUser, navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/"); // Redirect to the homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>FlavorFusion Dashboard</h2>
        <ul>
          {/* Removed Home Button */}
          <li><button onClick={() => navigate("/upload")}>Upload Recipe</button></li>
          <li><button onClick={() => navigate("/profile")}>Profile</button></li>
          <li><button onClick={() => navigate("/recipes")}>View Recipes</button></li>
          <li><button onClick={handleLogout}>Logout</button></li> {/* Logout button */}
        </ul>

        {/* Profile message */}
        {userData && (
          <div className="profile-message">
            <p><strong>Welcome, {userData.name}!</strong></p>
            <p>Click the button to go to your profile.</p>
          </div>
        )}
      </div>

      <div className="dashboard-content">
        <div className="header">
          <div className="profile-info">
            {/* User profile icon */}
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="profile-icon"
              />
            ) : (
              <FaUserCircle className="profile-icon" />
            )}
            <div className="user-details">
              <h1>Welcome back, {userData?.name}</h1>
              <p>{userData?.email}</p>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="profile-summary">
            <h3>Your Profile</h3>
            {userData?.profilePicture && (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="profile-picture"
              />
            )}
            <p><strong>Name:</strong> {userData?.name}</p>
            <p><strong>Email:</strong> {userData?.email}</p>
            <p><strong>Member Since:</strong> {new Date(userData?.joinDate).toLocaleDateString()}</p>
          </div>

          <div className="recipe-summary">
            <h3>Your Recipes</h3>
            <button className="upload-btn" onClick={() => navigate("/upload")}>Upload New Recipe</button>
            <div className="recipe-cards">
              {userRecipes.length === 0 ? (
                <p>No recipes found. Upload your first recipe!</p>
              ) : (
                userRecipes.map((recipe, index) => (
                  <div key={index} className="recipe-card">
                    <img
                      src={recipe.imageURL}
                      alt={recipe.title}
                      className="recipe-image"
                    />
                    <h4>{recipe.title}</h4>
                    <p>{recipe.category} - {recipe.cuisine}</p>
                    <div className="recipe-info">
                      <div className="recipe-rating">
                        <FaThumbsUp /> {recipe.likes || 0} Likes
                      </div>
                      <div className="recipe-comments">
                        <FaCommentDots /> {recipe.comments?.length || 0} Comments
                      </div>
                    </div>
                    <button onClick={() => navigate(`/recipe/${recipe.id}`)}>View</button>
                    <button onClick={() => navigate(`/edit/${recipe.id}`)}>Edit</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="recommendations">
            <h3>Recommended for You</h3>
            <div className="recommended-recipes">
              <p>No recommendations available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
