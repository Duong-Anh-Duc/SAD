import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { createAppointment, getAllDoctors } from "../redux/actions";
import CancelAppointment from "./CancelAppointment";

const { Option } = Select;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #28a745;
    color: white;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: #e6f4ea;
  }
`;

const AddButton = styled(Button)`
  background: #28a745;
  border-color: #28a745;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover,
  &:focus {
    background: #218838;
    border-color: #218838;
    transform: scale(1.02);
  }
`;

const LinkButton = styled(Button)`
  background: #28a745;
  border-color: #28a745;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  margin-right: 16px;
  margin-bottom: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover,
  &:focus {
    background: #218838;
    border-color: #218838;
    transform: scale(1.02);
  }
`;

const Appointments = ({ appointments, patientId, onUpdate }) => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.patient.doctors || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getAllDoctors()).catch(() => {
      toast.error("Không lấy được danh sách bác sĩ!");
    });
  }, [dispatch]);

  const showModal = () => setIsModalVisible(true);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const appointmentData = {
        patient_id: patientId,
        doctor_id: values.doctor_id,
        ngay_kham: values.ngay_kham.format("YYYY-MM-DD"),
        gio_kham: values.gio_kham.format("HH:mm:ss"),
        trang_thai: "cho_xac_nhan",
        mo_ta: values.mo_ta,
      };
      await dispatch(createAppointment(appointmentData));
      toast.success("Đặt lịch khám thành công!");
      setIsModalVisible(false);
      form.resetFields();
      onUpdate();
    } catch (err) {
      toast.error("Đặt lịch khám thất bại!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: "Bác sĩ ID", dataIndex: "doctor_id", key: "doctor_id" },
    { title: "Ngày khám", dataIndex: "ngay_kham", key: "ngay_kham" },
    { title: "Giờ khám", dataIndex: "gio_kham", key: "gio_kham" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.trang_thai === "cho_xac_nhan" ? (
          <CancelAppointment appointmentId={record.id} onSuccess={onUpdate} />
        ) : null,
    },
  ];

  return (
    <>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Lịch khám
      </Title>
      <LinkButton>
        <Link to="/doctors">Xem danh sách bác sĩ</Link>
      </LinkButton>
      <LinkButton>
        <Link to="/payments">Xem hóa đơn</Link>
      </LinkButton>
      <AddButton type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Đặt lịch khám
      </AddButton>
      <StyledTable columns={columns} dataSource={appointments} rowKey="id" />
      <Modal
        title="Đặt lịch khám"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Bác sĩ"
            name="doctor_id"
            rules={[{ required: true, message: "Vui lòng chọn bác sĩ!" }]}
          >
            <Select placeholder="Chọn bác sĩ" style={{ width: "100%" }}>
              {doctors.map((doctor) => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.ten} ({doctor.khoa})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày khám"
            name="ngay_kham"
            rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Giờ khám"
            name="gio_kham"
            rules={[{ required: true, message: "Vui lòng chọn giờ khám!" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item label="Mô tả" name="mo_ta">
            <Input.TextArea placeholder="Lý do khám" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Appointments;
