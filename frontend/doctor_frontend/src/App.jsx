import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorDetail from "./pages/DoctorDetail";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";

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
          <Route
            path="/register"
            element={
              <ProtectedRoute redirectTo="/detail">
                <DoctorRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute redirectTo="/detail">
                <DoctorLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail"
            element={
              <ProtectedRoute redirectTo="/login">
                <DoctorDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectTo="/detail">
                <DoctorLogin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
