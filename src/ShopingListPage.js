// import React, { useState } from "react";
// import "./ShoppingListPage.css";

// const ShoppingListPage = () => {
//   const [items, setItems] = useState([]);
//   const [newItem, setNewItem] = useState("");

//   const addItem = () => {
//     if (newItem.trim() !== "") {
//       setItems([...items, newItem]);
//       setNewItem("");
//     }
//   };

//   const removeItem = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index);
//     setItems(updatedItems);
//   };

//   return (
//     <div className="shopping-list-container">
//       <h1>Shopping List</h1>
//       <div className="input-section">
//         <input
//           type="text"
//           placeholder="Add an item..."
//           value={newItem}
//           onChange={(e) => setNewItem(e.target.value)}
//         />
//         <button onClick={addItem}>Add</button>
//       </div>
//       <ul className="shopping-list">
//         {items.map((item, index) => (
//           <li key={index}>
//             {item} <button onClick={() => removeItem(index)}>Remove</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ShoppingListPage;


// src/RecipeListPage.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipeData);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipe-list-container">
      <h1>All Recipes</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.imageURL} alt={recipe.title} />
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>
            <Link to={`/recipe/${recipe.id}`} className="view-recipe">View Recipe</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeListPage;
