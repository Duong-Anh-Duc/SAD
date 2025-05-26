import { LockOutlined, MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { registerStaff } from "../redux/actions";

const Container = styled.div`
  max-width: 480px;
  margin: 60px auto;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #28a745;
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  text-align: center;
  margin-bottom: 16px;
  font-weight: 500;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 600;
    color: #333;
  }

  .ant-input,
  .ant-picker,
  .ant-input-password {
    border-radius: 10px;
    padding: 12px 16px;
    border: 1px solid #d9d9d9;
    background: #f9f9f9;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border-color: #28a745;
      background: white;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
    }
  }

  .ant-input-affix-wrapper {
    border-radius: 10px;
    padding: 8px 16px;
    background: #f9f9f9;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border-color: #28a745;
      background: white;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
    }
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  background: #28a745;
  border-color: #28a745;
  color: white;
  font-weight: 600;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover,
  &:focus {
    background: #218838;
    border-color: #218838;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #555;

  a {
    color: #28a745;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #218838;
      text-decoration: underline;
    }
  }
`;

const StaffRegister = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.staff.error);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const staffData = {
        ten: values.ten,
        email: values.email,
        mat_khau: values.mat_khau,
      };
      await dispatch(registerStaff(staffData));
      toast.success("Đăng ký thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
    } catch (err) {
      const errorMessage = error?.message || "Đăng ký thất bại!";
      const errorDetails = error?.errors ? JSON.stringify(error.errors) : "";
      toast.error(`${errorMessage} ${errorDetails}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Container>
      <Title>
        <UserAddOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Đăng ký nhân viên
      </Title>
      {error && <ErrorText>{error.message}</ErrorText>}
      <StyledForm onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Tên"
          name="ten"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input
            prefix={<UserAddOutlined style={{ color: "#28a745" }} />}
            placeholder="Họ và tên"
          />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Vui lòng nhập email hợp lệ!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#28a745" }} />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="mat_khau"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#28a745" }} />}
            placeholder="Mật khẩu"
          />
        </Form.Item>
        <Form.Item>
          <SubmitButton type="primary" htmlType="submit">
            <UserAddOutlined />
            Đăng ký
          </SubmitButton>
        </Form.Item>
      </StyledForm>
      <LinkText>
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </LinkText>
    </Container>
  );
};

export default StaffRegister;
