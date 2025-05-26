import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo }) => {
  const admin = useSelector((state) => state.admin.admin);
  const isLoggedIn = !!localStorage.getItem("access_token") && !!admin;

  if (isLoggedIn && redirectTo === "/home") {
    return <Navigate to="/home" />;
  }

  if (!isLoggedIn && redirectTo !== "/home") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
