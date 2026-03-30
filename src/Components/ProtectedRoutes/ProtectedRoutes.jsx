import React, { useContext } from "react";

import { Navigate } from "react-router-dom";
import { authContext } from "../../Context/AuthiContext";

export default function ProtectedRoutes({ children }) {
  const { userToken } = useContext(authContext);
  if (userToken === null) {
    return <Navigate to={"/auth"} />;
  }
  return <>{children}</>;
}
