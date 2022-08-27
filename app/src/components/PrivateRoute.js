import React from "react";
import {Navigate} from "react-router-dom";
function PrivateRoute({ children, ...rest }) {
  const currentUser = localStorage.getItem("authToken")
  return currentUser ? children : <Navigate to="/login" />;

}

export default PrivateRoute;
