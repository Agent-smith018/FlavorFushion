// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";
// import { getDatabase, ref, get } from "firebase/database";
// import { FaThumbsUp, FaCommentDots, FaShare } from "react-icons/fa"; // Include the share icon
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [userRecipes, setUserRecipes] = useState([]);
//   const [userActivity, setUserActivity] = useState({ likes: 0, comments: 0, shares: 0 });
//   const [loading, setLoading] = useState(true);
//   const [recommendedRecipes, setRecommendedRecipes] = useState([]);
//   const [popularRecipes, setPopularRecipes] = useState([]); // State for popular recipes
//   const [sortOption, setSortOption] = useState("trending"); // Add state for sorting option
//   const [savedRecipes, setSavedRecipes] = useState([]);
//   const [suggestedUsers, setSuggestedUsers] = useState([]); // State for suggested users to follow
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!auth.currentUser) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const db = getDatabase();
//         const userRef = ref(db, `users/${auth.currentUser.uid}`);
//         const userSnapshot = await get(userRef);
//         setUserData(userSnapshot.val());

//         // Fetch user's recipes
//         const recipesRef = ref(db, "recipes");
//         const recipesSnapshot = await get(recipesRef);
//         const userRecipesList = [];
//         const allRecipesList = [];
//         recipesSnapshot.forEach((childSnapshot) => {
//           const recipe = childSnapshot.val();
//           if (recipe.userId === auth.currentUser.uid) {
//             userRecipesList.push(recipe);
//           }
//           allRecipesList.push(recipe); // Save all recipes for sorting
//         });
//         setUserRecipes(userRecipesList);

//         // Fetch user activity (likes, comments, shares)
//         const activityRef = ref(db, `activities/${auth.currentUser.uid}`);
//         const activitySnapshot = await get(activityRef);
//         setUserActivity(activitySnapshot.val() || { likes: 0, comments: 0, shares: 0 });

//         // Fetch recommended recipes (for the user)
//         const recommendedList = allRecipesList.filter(recipe => recipe.userId !== auth.currentUser.uid);
//         setRecommendedRecipes(recommendedList.slice(0, 5)); // Show only 5 recommended recipes

//         // Set popular recipes and sort based on the trend score
//         const sortedPopularRecipes = allRecipesList.sort((a, b) => {
//           const trendScoreA = (a.likes || 0) + (a.comments?.length || 0) + (a.shares || 0);
//           const trendScoreB = (b.likes || 0) + (b.comments?.length || 0) + (b.shares || 0);
//           return trendScoreB - trendScoreA;
//         });
//         setPopularRecipes(sortedPopularRecipes.slice(0, 5)); // Show top 5 popular recipes

//         // Fetch saved recipes
//         const savedRef = ref(db, `savedRecipes/${auth.currentUser.uid}`);
//         const savedSnapshot = await get(savedRef);
//         const savedList = [];
//         savedSnapshot.forEach((childSnapshot) => {
//           savedList.push(childSnapshot.val());
//         });
//         setSavedRecipes(savedList);

//         // Fetch suggested users (exclude the current user)
//         const usersRef = ref(db, "users");
//         const usersSnapshot = await get(usersRef);
//         const allUsersList = [];
//         usersSnapshot.forEach((childSnapshot) => {
//           const user = childSnapshot.val();
//           // Ensure the current user's profile is excluded
//           if (user.id !== auth.currentUser.uid) { // Exclude current user by checking ID
//             allUsersList.push(user);
//           }
//         });
//         setSuggestedUsers(allUsersList); // Set suggested users to follow
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [auth.currentUser, navigate]);

//   // Sort recipes based on trend score
//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//   };

//   const sortRecipes = (recipes) => {
//     switch (sortOption) {
//       case "trending":
//         return recipes.sort((a, b) => {
//           const trendScoreA = (a.likes || 0) + (a.comments?.length || 0) + (a.shares || 0);
//           const trendScoreB = (b.likes || 0) + (b.comments?.length || 0) + (b.shares || 0);
//           return trendScoreB - trendScoreA;
//         });
//       case "newest":
//         return recipes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
//       default:
//         return recipes;
//     }
//   };

//   // Logout handler
//   const handleLogout = async () => {
//     try {
//       await signOut(auth); // Sign out the user
//       navigate("/"); // Redirect to the homepage after logout
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   if (loading) return <div className="loader">Loading...</div>;

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <h2 className="dashboard-title">FlavorFusion</h2>
//           <p className="dashboard-subtitle">Your Recipe Dashboard</p>
//         </div>
//         <ul className="sidebar-links">
//           <li>
//             <button onClick={() => navigate("/dashboard")} className="sidebar-btn">Dashboard</button>
//           </li>
//           <li>
//             <button onClick={() => navigate("/upload")} className="sidebar-btn">Upload Recipe</button>
//           </li>
//           <li>
//             <button onClick={() => navigate("/profile")} className="sidebar-btn">Profile</button>
//           </li>
//           <li>
//             <button onClick={() => navigate("/recipes")} className="sidebar-btn">View Recipes</button>
//           </li>
//           <li>
//             <button onClick={() => navigate("/my-recipes")} className="sidebar-btn">Saved Recipes</button>
//           </li>
//           <li>
//             <button onClick={handleLogout} className="sidebar-btn logout-btn">Logout</button>
//           </li>
//         </ul>
//       </div>

//       <div className="dashboard-content">
//         <header className="dashboard-header">
//           <h1>Welcome back, {userData?.name}</h1>
//           <div className="user-profile-info">
//             <img
//               src={userData?.profilePic || "/default-avatar.png"}
//               alt="Profile"
//               className="profile-pic"
//               onClick={() => navigate("/profile")}
//             />
//             <p>{userData?.email}</p>
//           </div>
//         </header>

//         <section className="user-stats">
//           <div className="user-overview">
//             <h3>Your Overview</h3>
//             <div className="overview-stats">
//               <p><strong>Total Recipes:</strong> {userRecipes.length}</p>
//               <p><strong>Total Likes:</strong> {userActivity.likes}</p>
//               <p><strong>Total Comments:</strong> {userActivity.comments}</p>
//               <p><strong>Total Shares:</strong> {userActivity.shares}</p>
//             </div>
//           </div>

//           <div className="recipe-summary">
//             <h3>Recently Uploaded Recipes</h3>
//             <div className="recipe-cards">
//               {userRecipes.length === 0 ? (
//                 <p>No recipes found. Upload your first recipe!</p>
//               ) : (
//                 userRecipes.slice(0, 3).map((recipe, index) => (
//                   <div key={index} className="recipe-card">
//                     <img
//                       src={recipe.imageURL || "/fallback-image.png"}
//                       alt={recipe.title}
//                       className="recipe-image"
//                     />
//                     <h4>{recipe.title}</h4>
//                     <p>{recipe.category} - {recipe.cuisine}</p>
//                     <div className="recipe-info">
//                       <div className="recipe-rating">
//                         <FaThumbsUp /> {recipe.likes || 0} Likes
//                       </div>
//                       <div className="recipe-comments">
//                         <FaCommentDots /> {recipe.comments?.length || 0} Comments
//                       </div>
//                       <div className="recipe-shares">
//                         <FaShare /> {recipe.shares || 0} Shares
//                       </div>
//                     </div>
//                     <div className="recipe-actions">
//                       <button onClick={() => navigate(`/recipe/${recipe.id}`)} className="view-btn">View</button>
//                       <button onClick={() => navigate(`/edit/${recipe.id}`)} className="edit-btn">Edit</button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Sort Options */}
//         <section className="sort-recipes">
//           <label htmlFor="sort-option">Sort By:</label>
//           <select id="sort-option" value={sortOption} onChange={handleSortChange}>
//             <option value="trending">Trending</option>
//             <option value="newest">Newest</option>
//           </select>
//         </section>

//         {/* Popular Recipes Section */}
//         <section className="popular-recipes">
//           <h3>Popular Recipes</h3>
//           <div className="recipe-cards">
//             {sortRecipes(popularRecipes).map((recipe, index) => (
//               <div key={index} className="recipe-card">
//                 <img
//                   src={recipe.imageURL || "/fallback-image.png"}
//                   alt={recipe.title}
//                   className="recipe-image"
//                 />
//                 <h4>{recipe.title}</h4>
//                 <p>{recipe.category} - {recipe.cuisine}</p>
//                 <div className="recipe-info">
//                   <div className="recipe-rating">
//                     <FaThumbsUp /> {recipe.likes || 0} Likes
//                   </div>
//                   <div className="recipe-comments">
//                     <FaCommentDots /> {recipe.comments?.length || 0} Comments
//                   </div>
//                   <div className="recipe-shares">
//                     <FaShare /> {recipe.shares || 0} Shares
//                   </div>
//                 </div>
//                 <button onClick={() => navigate(`/recipe/${recipe.id}`)} className="view-btn">View Recipe</button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Suggested Users Section */}
//         <section className="suggested-users">
//           <h3>Suggested Users to Follow</h3>
//           <div className="user-cards">
//             {suggestedUsers.length === 0 ? (
//               <p>No users to suggest at the moment.</p>
//             ) : (
//               suggestedUsers.map((user, index) => (
//                 <div key={index} className="user-card">
//                   <img
//                     src={user.profilePic || "/default-avatar.png"}
//                     alt={user.name}
//                     className="user-profile-pic"
//                   />
//                   <h4>{user.name}</h4>
//                   <p>{user.email}</p>
//                   <button onClick={() => navigate(`/profile/${user.id}`)} className="follow-btn">
//                     Follow
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>

//         <footer className="dashboard-footer">
//           <p>
//             <a href="/terms-of-service">Terms of Service</a> |{" "}
//             <a href="/privacy-policy">Privacy Policy</a>
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { FaThumbsUp, FaCommentDots, FaShare, FaShoppingCart } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userActivity, setUserActivity] = useState({ likes: 0, comments: 0, shares: 0 });
  const [loading, setLoading] = useState(true);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [sortOption, setSortOption] = useState("trending");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) {
        navigate("/login");
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
        const allRecipesList = [];
        recipesSnapshot.forEach((childSnapshot) => {
          const recipe = childSnapshot.val();
          if (recipe.userId === auth.currentUser.uid) {
            userRecipesList.push(recipe);
          }
          allRecipesList.push(recipe); // Save all recipes for sorting
        });
        setUserRecipes(userRecipesList);

        // Fetch user activity (likes, comments, shares)
        const activityRef = ref(db, `activities/${auth.currentUser.uid}`);
        const activitySnapshot = await get(activityRef);
        setUserActivity(activitySnapshot.val() || { likes: 0, comments: 0, shares: 0 });

        // Fetch recommended recipes (for the user)
        const recommendedList = allRecipesList.filter(recipe => recipe.userId !== auth.currentUser.uid);
        setRecommendedRecipes(recommendedList.slice(0, 5)); // Show only 5 recommended recipes

        // Set popular recipes and sort based on the trend score
        const sortedPopularRecipes = allRecipesList.sort((a, b) => {
          const trendScoreA = (a.likes || 0) + (a.comments?.length || 0) + (a.shares || 0);
          const trendScoreB = (b.likes || 0) + (b.comments?.length || 0) + (b.shares || 0);
          return trendScoreB - trendScoreA;
        });
        setPopularRecipes(sortedPopularRecipes.slice(0, 5)); // Show top 5 popular recipes

        // Fetch saved recipes
        const savedRef = ref(db, `savedRecipes/${auth.currentUser.uid}`);
        const savedSnapshot = await get(savedRef);
        const savedList = [];
        savedSnapshot.forEach((childSnapshot) => {
          savedList.push(childSnapshot.val());
        });
        setSavedRecipes(savedList);

        // Fetch suggested users (exclude the current user)
        const usersRef = ref(db, "users");
        const usersSnapshot = await get(usersRef);
        const allUsersList = [];
        usersSnapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          if (user.id !== auth.currentUser.uid) {
            allUsersList.push(user);
          }
        });
        setSuggestedUsers(allUsersList); // Set suggested users to follow
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth.currentUser, navigate]);

  // Sort recipes based on trend score
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortRecipes = (recipes) => {
    switch (sortOption) {
      case "trending":
        return recipes.sort((a, b) => {
          const trendScoreA = (a.likes || 0) + (a.comments?.length || 0) + (a.shares || 0);
          const trendScoreB = (b.likes || 0) + (b.comments?.length || 0) + (b.shares || 0);
          return trendScoreB - trendScoreA;
        });
      case "newest":
        return recipes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      default:
        return recipes;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/"); // Redirect to the homepage after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="dashboard-title">FlavorFusion</h2>
          <p className="dashboard-subtitle">Your Recipe Dashboard</p>
        </div>
        <ul className="sidebar-links">
          <li>
            <button onClick={() => navigate("/dashboard")} className="sidebar-btn">Dashboard</button>
          </li>
          <li>
            <button onClick={() => navigate("/upload")} className="sidebar-btn">Upload Recipe</button>
          </li>
          <li>
            <button onClick={() => navigate("/profile")} className="sidebar-btn">Profile</button>
          </li>
          <li>
            <button onClick={() => navigate("/recipes")} className="sidebar-btn">View Recipes</button>
          </li>
          <li>
            <button onClick={() => navigate("/my-recipes")} className="sidebar-btn">Saved Recipes</button>
          </li>
          <li>
            <button onClick={() => navigate("/meal-plans")} className="sidebar-btn">
              Meal Plans
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/shopping-list")} className="sidebar-btn">
              <FaShoppingCart /> Shopping List
            </button>
          </li>
          <li>
            <button onClick={handleLogout} className="sidebar-btn logout-btn">Logout</button>
          </li>
        </ul>
      </div>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome back, {userData?.name}</h1>
          <div className="user-profile-info">
            <img
              src={userData?.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="profile-pic"
              onClick={() => navigate("/profile")}
            />
            <p>{userData?.email}</p>
          </div>
        </header>

        <section className="user-stats">
          <div className="user-overview">
            <h3>Your Overview</h3>
            <div className="overview-stats">
              <p><strong>Total Recipes:</strong> {userRecipes.length}</p>
              <p><strong>Total Likes:</strong> {userActivity.likes}</p>
              <p><strong>Total Comments:</strong> {userActivity.comments}</p>
              <p><strong>Total Shares:</strong> {userActivity.shares}</p>
            </div>
          </div>

          <div className="recipe-summary">
            <h3>Recently Uploaded Recipes</h3>
            <div className="recipe-cards">
              {userRecipes.length === 0 ? (
                <p>No recipes found. Upload your first recipe!</p>
              ) : (
                userRecipes.slice(0, 3).map((recipe, index) => (
                  <div key={index} className="recipe-card">
                    <img
                      src={recipe.imageURL || "/fallback-image.png"}
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
                      <div className="recipe-shares">
                        <FaShare /> {recipe.shares || 0} Shares
                      </div>
                    </div>
                    <div className="recipe-actions">
                      <button onClick={() => navigate(`/recipe/${recipe.id}`)} className="view-btn">View</button>
                      <button onClick={() => navigate(`/edit/${recipe.id}`)} className="edit-btn">Edit</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="sort-recipes">
          <label htmlFor="sort-option">Sort By:</label>
          <select id="sort-option" value={sortOption} onChange={handleSortChange}>
            <option value="trending">Trending</option>
            <option value="newest">Newest</option>
          </select>
        </section>

        <section className="popular-recipes">
          <h3>Popular Recipes</h3>
          <div className="recipe-cards">
            {sortRecipes(popularRecipes).map((recipe, index) => (
              <div key={index} className="recipe-card">
                <img
                  src={recipe.imageURL || "/fallback-image.png"}
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
                  <div className="recipe-shares">
                    <FaShare /> {recipe.shares || 0} Shares
                  </div>
                </div>
                <button onClick={() => navigate(`/recipe/${recipe.id}`)} className="view-btn">View Recipe</button>
              </div>
            ))}
          </div>
        </section>

        <section className="suggested-users">
          <h3>Suggested Users to Follow</h3>
          <div className="user-cards">
            {suggestedUsers.length === 0 ? (
              <p>No users to suggest at the moment.</p>
            ) : (
              suggestedUsers.map((user, index) => (
                <div key={index} className="user-card">
                  <img
                    src={user.profilePic || "/default-avatar.png"}
                    alt={user.name}
                    className="user-profile-pic"
                  />
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <button onClick={() => navigate(`/profile/${user.id}`)} className="follow-btn">
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="dashboard-footer">
          <p>
            <a href="/terms-of-service">Terms of Service</a> |{" "}
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
