// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";
// import { getDatabase, ref, set, get } from "firebase/database";
// import { FaPlus } from "react-icons/fa";
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import "./MealPlanner.css";

// const MealPlanner = () => {
//   const [userData, setUserData] = useState(null);
//   const [userRecipes, setUserRecipes] = useState([]);
//   const [mealPlan, setMealPlan] = useState({});
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const navigate = useNavigate();
//   const auth = getAuth();

//   // Fetch user's recipes and meal plan
//   useEffect(() => {
//     const fetchMealPlanData = async () => {
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
//         recipesSnapshot.forEach((childSnapshot) => {
//           const recipe = childSnapshot.val();
//           if (recipe.userId === auth.currentUser.uid) {
//             userRecipesList.push(recipe);
//           }
//         });
//         setUserRecipes(userRecipesList);

//         // Fetch meal plan
//         const mealPlanRef = ref(db, `mealPlans/${auth.currentUser.uid}`);
//         const mealPlanSnapshot = await get(mealPlanRef);
//         setMealPlan(mealPlanSnapshot.val() || {});
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchMealPlanData();
//   }, [auth.currentUser, navigate]);

//   // Handle adding a recipe to the meal plan
//   const handleAddToMealPlan = () => {
//     if (selectedRecipe && selectedDate) {
//       const db = getDatabase();
//       const formattedDate = selectedDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD
//       const mealPlanRef = ref(db, `mealPlans/${auth.currentUser.uid}/${formattedDate}`);
//       set(mealPlanRef, selectedRecipe)
//         .then(() => {
//           setMealPlan((prevMealPlan) => ({
//             ...prevMealPlan,
//             [formattedDate]: selectedRecipe,
//           }));
//           setSelectedRecipe(null);
//         })
//         .catch((error) => {
//           console.error("Error adding to meal plan:", error);
//         });
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

//   return (
//     <div className="meal-planner-container">
//       <div className="meal-planner-content">
//         <header className="meal-planner-header">
//           <h1>Welcome, {userData?.name}</h1>
//         </header>

//         <section className="recipe-selection">
//           <h3>Select a Recipe to Add</h3>
//           <select
//             value={selectedRecipe?.id || ""}
//             onChange={(e) => {
//               const recipe = userRecipes.find((r) => r.id === e.target.value);
//               setSelectedRecipe(recipe);
//             }}
//           >
//             <option value="">Select Recipe</option>
//             {userRecipes.map((recipe) => (
//               <option key={recipe.id} value={recipe.id}>
//                 {recipe.title}
//               </option>
//             ))}
//           </select>
//         </section>

//         <section className="meal-plan-input">
//           <h3>Pick a Date to Add the Recipe</h3>
//           <Calendar
//             onChange={setSelectedDate}
//             value={selectedDate}
//           />
//           <button onClick={handleAddToMealPlan} className="add-to-plan-btn">
//             <FaPlus /> Add to Meal Plan
//           </button>
//         </section>

//         <section className="meal-plan-calendar">
//           <h3>Your Meal Planner</h3>
//           <div className="calendar">
//             {Object.keys(mealPlan).map((date) => (
//               <div key={date} className="calendar-day">
//                 <div>{date}</div>
//                 <div>{mealPlan[date]?.title}</div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default MealPlanner;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { FaPlus, FaCalendarAlt } from "react-icons/fa";
import "./MealPlanner.css";

const MealPlanner = () => {
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [mealPlanStatistics, setMealPlanStatistics] = useState({
    totalMeals: 0,
    totalCalories: 0,
    totalNutrients: { protein: 0, carbs: 0, fat: 0 },
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch user's recipes, meal plan, and statistics
  useEffect(() => {
    const fetchMealPlanData = async () => {
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
        recipesSnapshot.forEach((childSnapshot) => {
          const recipe = childSnapshot.val();
          if (recipe.userId === auth.currentUser.uid) {
            userRecipesList.push(recipe);
          }
        });
        setUserRecipes(userRecipesList);

        // Fetch meal plan
        const mealPlanRef = ref(db, `mealPlans/${auth.currentUser.uid}`);
        const mealPlanSnapshot = await get(mealPlanRef);
        const mealPlanData = mealPlanSnapshot.val() || {};
        setMealPlan(mealPlanData);

        // Calculate meal plan statistics
        let totalMeals = 0;
        let totalCalories = 0;
        let totalNutrients = { protein: 0, carbs: 0, fat: 0 };

        Object.values(mealPlanData).forEach((meal) => {
          totalMeals += 1;
          totalCalories += meal.calories || 0;
          totalNutrients.protein += meal.protein || 0;
          totalNutrients.carbs += meal.carbs || 0;
          totalNutrients.fat += meal.fat || 0;
        });

        setMealPlanStatistics({
          totalMeals,
          totalCalories,
          totalNutrients,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMealPlanData();
  }, [auth.currentUser, navigate]);

  // Handle adding a recipe to the meal plan
  const handleAddToMealPlan = () => {
    if (selectedRecipe && selectedDate) {
      const db = getDatabase();
      const mealPlanRef = ref(db, `mealPlans/${auth.currentUser.uid}/${selectedDate}`);
      
      // Add the recipe to the meal plan
      set(mealPlanRef, selectedRecipe)
        .then(() => {
          setMealPlan((prevMealPlan) => ({
            ...prevMealPlan,
            [selectedDate]: selectedRecipe,
          }));

          // Add ingredients to the shopping list
          const shoppingListRef = ref(db, `shoppingList/${auth.currentUser.uid}`);
          selectedRecipe.ingredients.forEach((ingredient) => {
            const ingredientRef = ref(shoppingListRef, ingredient.name);
            set(ingredientRef, { quantity: ingredient.quantity, recipeId: selectedRecipe.id });
          });

          setSelectedRecipe(null);
          setSelectedDate("");
        })
        .catch((error) => {
          console.error("Error adding to meal plan:", error);
        });
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

  return (
    <div className="meal-planner-container">
      <header className="meal-planner-header">
        <h1>Welcome, {userData?.name}</h1>
      </header>

      <section className="recipe-selection">
        <h3>Select a Recipe to Add</h3>
        <select
          value={selectedRecipe?.id || ""}
          onChange={(e) => {
            const recipe = userRecipes.find((r) => r.id === e.target.value);
            setSelectedRecipe(recipe);
          }}
        >
          <option value="">Select Recipe</option>
          {userRecipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.title}
            </option>
          ))}
        </select>
      </section>

      <section className="meal-plan-input">
        <h3>Pick a Date to Add the Recipe</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={handleAddToMealPlan} className="add-to-plan-btn">
          <FaPlus /> Add to Meal Plan
        </button>
      </section>

      <section className="meal-plan-calendar">
        <h3>Your Meal Planner</h3>
        <div className="calendar">
          {Object.keys(mealPlan).map((date) => (
            <div key={date} className="calendar-day">
              <div>{date}</div>
              <div>{mealPlan[date]?.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="meal-plan-statistics">
        <h3>Meal Plan Statistics</h3>
        <p>Total Meals: {mealPlanStatistics.totalMeals}</p>
        <p>Total Calories: {mealPlanStatistics.totalCalories}</p>
        <p>Total Protein: {mealPlanStatistics.totalNutrients.protein}g</p>
        <p>Total Carbs: {mealPlanStatistics.totalNutrients.carbs}g</p>
        <p>Total Fat: {mealPlanStatistics.totalNutrients.fat}g</p>
      </section>

      <footer>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </footer>
    </div>
  );
};

export default MealPlanner;
