// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { get, ref } from "firebase/database";
// import { rtdb } from "./firebase";
// import { getAuth, onAuthStateChanged } from "firebase/auth";  // Import to get the current user
// import './RecipeListPage.css'; // Import the corresponding CSS

// const RecipeListPage = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [drafts, setDrafts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null); // Track user state
//   const navigate = useNavigate();

//   const auth = getAuth(); // Firebase Auth instance

//   useEffect(() => {
//     // Listen for authentication state changes (on page reload, or login/logout)
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user); // Set user state when logged in
//       } else {
//         setUser(null); // Set user state to null when logged out
//         navigate("/login"); // Redirect to login if no user is logged in
//       }
//     });

//     // Cleanup the listener when the component unmounts or changes
//     return () => unsubscribe();
//   }, [auth, navigate]);

//   useEffect(() => {
//     // Fetch recipes and drafts only if user is logged in
//     if (user) {
//       const fetchRecipesAndDrafts = async () => {
//         try {
//           const recipeRef = ref(rtdb, "recipes");
//           const draftRef = ref(rtdb, "drafts");

//           const [recipeSnapshot, draftSnapshot] = await Promise.all([
//             get(recipeRef),
//             get(draftRef),
//           ]);

//           if (recipeSnapshot.exists()) {
//             const recipesData = recipeSnapshot.val();
//             // Filter the recipes that belong to the logged-in user
//             setRecipes(
//               Object.entries(recipesData)
//                 .filter(([id, data]) => data.userId === user.uid) // Only show user's recipes
//                 .map(([id, data]) => ({ id, ...data }))
//             );
//           }

//           if (draftSnapshot.exists()) {
//             const draftsData = draftSnapshot.val();
//             // Filter the drafts that belong to the logged-in user
//             setDrafts(
//               Object.entries(draftsData)
//                 .filter(([id, data]) => data.userId === user.uid) // Only show user's drafts
//                 .map(([id, data]) => ({ id, ...data }))
//             );
//           }
//         } catch (error) {
//           console.error("Error fetching recipes or drafts:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchRecipesAndDrafts();
//     }
//   }, [user]); // Run the effect when the user state changes

//   if (loading) return <p>Loading recipes...</p>;

//   return (
//     <div className="recipe-list-page">
//       <h1>Your Uploaded Recipes</h1>
//       <div className="recipe-container">
//         {recipes.length > 0 ? (
//           recipes.map((recipe) => (
//             <div key={recipe.id} className="recipe-card">
//               <h3>{recipe.title}</h3>
//               <p>{recipe.description}</p>
//               <button onClick={() => navigate(`/recipe/${recipe.id}`)}>View Recipe</button>
//             </div>
//           ))
//         ) : (
//           <p className="empty-state">No recipes found.</p>
//         )}
//       </div>

//       <h2>Your Draft Recipes</h2>
//       <div className="recipe-container">
//         {drafts.length > 0 ? (
//           drafts.map((draft) => (
//             <div key={draft.id} className="recipe-card">
//               <h3>{draft.title}</h3>
//               <p>{draft.description}</p>
//               <button onClick={() => navigate(`/edit-draft/${draft.id}`)}>Edit Draft</button>
//             </div>
//           ))
//         ) : (
//           <p className="empty-state">No drafts found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecipeListPage;
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { get, ref } from "firebase/database";
import { rtdb } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import './RecipeListPage.css'; 

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); 
      } else {
        setUser(null); 
        navigate("/login"); 
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (user) {
      const fetchRecipesAndDrafts = async () => {
        try {
          const recipeRef = ref(rtdb, "recipes");
          const draftRef = ref(rtdb, "drafts");

          const [recipeSnapshot, draftSnapshot] = await Promise.all([
            get(recipeRef),
            get(draftRef),
          ]);

          if (recipeSnapshot.exists()) {
            const recipesData = recipeSnapshot.val();
            setRecipes(
              Object.entries(recipesData)
                .filter(([id, data]) => data.userId === user.uid) 
                .map(([id, data]) => ({ id, ...data }))
            );
          }

          if (draftSnapshot.exists()) {
            const draftsData = draftSnapshot.val();
            setDrafts(
              Object.entries(draftsData)
                .filter(([id, data]) => data.userId === user.uid)
                .map(([id, data]) => ({ id, ...data }))
            );
          }
        } catch (error) {
          console.error("Error fetching recipes or drafts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipesAndDrafts();
    }
  }, [user]); 

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div className="recipe-list-page">
      <h1>Your Uploaded Recipes</h1>
      <div className="recipe-container">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <p>
                By: <Link to={`/user/${recipe.userId}`}>{recipe.userName || 'Unknown User'}</Link>
              </p>
              <button onClick={() => navigate(`/recipe/${recipe.id}`)}>View Recipe</button>
            </div>
          ))
        ) : (
          <p className="empty-state">No recipes found.</p>
        )}
      </div>

      <h2>Your Draft Recipes</h2>
      <div className="recipe-container">
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <div key={draft.id} className="recipe-card">
              <h3>{draft.title}</h3>
              <p>{draft.description}</p>
              <button onClick={() => navigate(`/edit-draft/${draft.id}`)}>Edit Draft</button>
            </div>
          ))
        ) : (
          <p className="empty-state">No drafts found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeListPage;
