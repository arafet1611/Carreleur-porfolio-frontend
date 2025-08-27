import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  // Check if token exists in localStorage (or use context/state)
  const token = localStorage.getItem("adminToken");
console.log(token)
  if (!token) {
    // If not logged in, redirect to homepage
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
