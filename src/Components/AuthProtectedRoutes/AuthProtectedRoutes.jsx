import React, { useContext } from "react";

import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/AuthiContext";

export default function AuthProtectedRoutes({ children }) {
  const { userToken } = useContext(authContext);
  if (userToken !== null) {
    return <Navigate to={"/home"} />;
  }
  return <>{children}</>;
}
