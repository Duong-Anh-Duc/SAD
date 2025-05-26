import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffHome from "./pages/StaffHome"; // Thêm trang Home
import StaffLogin from "./pages/StaffLogin";
import StaffRegister from "./pages/StaffRegister";

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
          <Route path="/register" element={<StaffRegister />} />
          <Route path="/login" element={<StaffLogin />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute redirectTo="/login">
                <StaffHome />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<StaffLogin />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
