import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminHome from "./pages/AdminHome"; // Thêm trang Home
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

const AppContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e6f4ea 100%);
  min-height: 100vh;
`;

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute redirectTo="/login">
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<AdminLogin />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
