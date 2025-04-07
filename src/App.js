// // App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./HomePage";
// import LoginPage from "./LoginPage";
// import RegisterPage from "./RegisterPage";
// import ResetPasswordPage from "./ResetPasswordPage";
// import UploadPage from "./UploadPage";
// import RecipePage from "./RecipePage";
// import RecipeSearch from "./RecipeSearch";
// import AddRecipePage from "./AddRecipePage";
// import RecipeListPage from "./RecipeListPage";
// import Dashboard from "./Dashboard";
// import UserProfile from "./UserProfile";
// import PersonalDetailsPage from "./PersonalDetailsPage";
// import OtherUserProfile from "./OtherUserProfile";
// import AdminPanel from "./AdminPanel";  // Admin Panel Component
// import AdminRoute from "./AdminRoute";  // Admin Route Protection

// // Import the new admin components
// import ManageRecipes from "./pages/ManageRecipes";
// import ModerateComments from "./pages/ModerateComments";
// import ManageUsers from "./pages/ManageUsers";
// import Analytics from "./pages/Analytics";

// import "./App.css";

// const App = () => {
//   return (
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/reset-password" element={<ResetPasswordPage />} />
//         <Route path="/upload" element={<UploadPage />} />
//         <Route path="/recipe/:id" element={<RecipePage />} />
//         <Route path="/search" element={<RecipeSearch />} />
//         <Route path="/add-recipe" element={<AddRecipePage />} />
//         <Route path="/recipes" element={<RecipeListPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/profile" element={<UserProfile />} />
//         <Route path="/personal-details" element={<PersonalDetailsPage />} />
//         <Route path="/user/:userId" element={<OtherUserProfile />} />

//         {/* Protected Admin Route */}
//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <AdminPanel />
//             </AdminRoute>
//           }
//         />

//         {/* Admin Functionalities */}
//         <Route
//           path="/admin/manage-recipes"
//           element={
//             <AdminRoute>
//               <ManageRecipes />
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/moderate-comments"
//           element={
//             <AdminRoute>
//               <ModerateComments />
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/manage-users"
//           element={
//             <AdminRoute>
//               <ManageUsers />
//             </AdminRoute>
//           }
//         />
//         <Route
//           path="/admin/analytics"
//           element={
//             <AdminRoute>
//               <Analytics />
//             </AdminRoute>
//           }
//         />
//       </Routes>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// General Pages
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import UploadPage from "./UploadPage";
import RecipePage from "./RecipePage";
import RecipeSearch from "./RecipeSearch";
import AddRecipePage from "./AddRecipePage";
import RecipeListPage from "./RecipeListPage";
import Dashboard from "./Dashboard";
import UserProfile from "./UserProfile";
import PersonalDetailsPage from "./PersonalDetailsPage";
import OtherUserProfile from "./OtherUserProfile";
import RecipeDetails from "./RecipeDetaisPage";
import UserRecipes from "./UserRecipes";
import ShoppingList from "./ShoppingList";
import MealPlanner from "./MealPlanner";
import EditProfile from "./EditProfile";

// Admin Pages and AdminRoute
import AdminPanel from "./AdminPanel";  // Admin Panel Component
import AdminRoute from "./AdminRoute";  // Admin Route Protection
import ManageRecipes from "./pages/ManageRecipes";
import ModerateComments from "./pages/ModerateComments";
import ManageUsers from "./pages/ManageUsers";
import Analytics from "./pages/Analytics";

// Admin Protection
import "./App.css";

const App = () => {
  return (
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/search" element={<RecipeSearch />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        <Route path="/recipes" element={<RecipeListPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/personal-details" element={<PersonalDetailsPage />} />
        <Route path="/user/:userId" element={<OtherUserProfile />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
        <Route path="/my-recipes" element={<UserRecipes />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/meal-plans" element={<MealPlanner />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        >
          {/* Nested Routes for Admin */}
          <Route path="manage-recipes" element={<ManageRecipes />} />
          <Route path="moderate-comments" element={<ModerateComments />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
  );
};

export default App;
