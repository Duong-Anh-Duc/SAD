import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo }) => {
  const staff = useSelector((state) => state.staff.staff);
  const isLoggedIn = !!localStorage.getItem("access_token") && !!staff;

  if (isLoggedIn && redirectTo === "/home") {
    return <Navigate to="/home" />;
  }

  if (!isLoggedIn && redirectTo !== "/home") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
