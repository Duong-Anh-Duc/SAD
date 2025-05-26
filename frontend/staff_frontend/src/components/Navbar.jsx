import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { logoutStaff } from "../redux/actions";

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  background: linear-gradient(90deg, #28a745, #34c759);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: white;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s ease, color 0.3s ease;

  &:hover {
    transform: scale(1.03);
    color: #e6f4ea;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  color: white !important;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  .anticon {
    color: white !important;
  }

  &:hover {
    background-color: #d9363e;
    border-color: #d9363e;
    transform: scale(1.05);
    color: white !important;
  }

  &:focus {
    background-color: #d9363e;
    border-color: #d9363e;
    color: white !important;
  }
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staff = useSelector((state) => state.staff.staff);
  const isLoggedIn = !!localStorage.getItem("access_token") && !!staff;

  const handleLogout = () => {
    dispatch(logoutStaff())
      .then(() => {
        toast.success("Đăng xuất thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/login");
      })
      .catch(() => {
        toast.error("Đăng xuất thất bại!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  return (
    <NavContainer>
      <NavTitle onClick={() => navigate("/")}>
        <HomeOutlined style={{ fontSize: "24px" }} />
        Hệ thống Y tế (Nhân viên)
      </NavTitle>
      {isLoggedIn && (
        <LogoutButton danger onClick={handleLogout}>
          <LogoutOutlined />
          Đăng xuất
        </LogoutButton>
      )}
    </NavContainer>
  );
};

export default Navbar;
