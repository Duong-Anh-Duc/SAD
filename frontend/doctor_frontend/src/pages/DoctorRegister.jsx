import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { registerDoctor } from "../redux/actions";

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
  .ant-input-password,
  .ant-select-selector {
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

const DoctorRegister = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.doctor.error);
  const navigate = useNavigate();

  const departments = [
    "Nội khoa",
    "Ngoại khoa",
    "Sản khoa",
    "Nhi khoa",
    "Răng Hàm Mặt",
    "Mắt",
    "Tai Mũi Họng",
    "Da liễu",
    "Thần kinh",
    "Tâm thần",
    "Hồi sức cấp cứu",
    "Chẩn đoán hình ảnh",
    "Y học cổ truyền",
  ];

  const positions = [
    { value: "truong_khoa", label: "Trưởng khoa" },
    { value: "pho_khoa", label: "Phó khoa" },
    { value: "bac_si", label: "Bác sĩ" },
  ];

  const onFinish = async (values) => {
    try {
      const doctorData = {
        ten: values.ten,
        email: values.email,
        mat_khau: values.mat_khau,
        khoa: values.khoa,
        chuc_vu: values.chuc_vu,
        gioi_thieu: values.gioi_thieu,
        so_dt: values.so_dt,
      };
      await dispatch(registerDoctor(doctorData)); // Chờ dispatch hoàn thành
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
        Đăng ký bác sĩ
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
        <Form.Item
          label="Khoa"
          name="khoa"
          rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
        >
          <Select placeholder="Chọn khoa">
            {departments.map((department) => (
              <Select.Option key={department} value={department}>
                {department}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Chức vụ"
          name="chuc_vu"
          rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
        >
          <Select placeholder="Chọn chức vụ">
            {positions.map((position) => (
              <Select.Option key={position.value} value={position.value}>
                {position.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Giới thiệu"
          name="gioi_thieu"
          rules={[{ required: true, message: "Vui lòng nhập giới thiệu!" }]}
        >
          <Input.TextArea rows={4} placeholder="Giới thiệu về bác sĩ" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="so_dt"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: "#28a745" }} />}
            placeholder="Số điện thoại"
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

export default DoctorRegister;
