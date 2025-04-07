import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get user info from useAuth

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if the user is logged in and has the correct admin UID
  if (user && user.uid === "UIEuQe42TUg0euOtDIvbNFLlrPJ2") {
    return children;
  }

  // If the user is not an admin or not logged in, redirect to login
  return <Navigate to="/dashboard" />;
};

export default AdminRoute;
