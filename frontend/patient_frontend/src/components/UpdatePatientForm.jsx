import { UserOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { updatePatient } from "../redux/actions";
const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 600;
    color: #333;
  }

  .ant-input,
  .ant-picker {
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

  .ant-radio-group {
    display: flex;
    gap: 16px;
  }
`;

const SubmitButton = styled(Button)`
  background: #28a745;
  border-color: #28a745;
  color: white;
  border-radius: 10px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover,
  &:focus {
    background: #218838;
    border-color: #218838;
    transform: scale(1.02);
  }
`;

const UpdatePatientForm = ({ patient, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const updatedData = {
        ten: values.ten,
        ngay_sinh: values.ngay_sinh.format("YYYY-MM-DD"),
        gioi_tinh: values.gioi_tinh,
        so_dt: values.so_dt,
        dia_chi: values.dia_chi,
      };
      await dispatch(updatePatient(patient.id, updatedData));
      toast.success("Cập nhật thông tin thành công!");
      onSuccess();
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại!");
    }
  };

  return (
    <StyledForm
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ten: patient.ten,
        ngay_sinh: patient.ngay_sinh ? moment(patient.ngay_sinh) : null,
        gioi_tinh: patient.gioi_tinh,
        so_dt: patient.so_dt,
        dia_chi: patient.dia_chi,
      }}
    >
      <Form.Item
        label="Tên"
        name="ten"
        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
      </Form.Item>
      <Form.Item
        label="Ngày sinh"
        name="ngay_sinh"
        rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
      >
        <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày sinh" />
      </Form.Item>
      <Form.Item
        label="Giới tính"
        name="gioi_tinh"
        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
      >
        <Radio.Group>
          <Radio value="Nam">Nam</Radio>
          <Radio value="Nữ">Nữ</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="so_dt"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <Input placeholder="Số điện thoại" />
      </Form.Item>
      <Form.Item
        label="Địa chỉ"
        name="dia_chi"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
      >
        <Input placeholder="Địa chỉ" />
      </Form.Item>
      <Form.Item>
        <SubmitButton type="primary" htmlType="submit">
          Cập nhật
        </SubmitButton>
      </Form.Item>
    </StyledForm>
  );
};

export default UpdatePatientForm;
