import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  List,
  Modal,
  Table,
  TimePicker,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  createAppointment,
  getAllPatients,
  getPatientDetail,
} from "../redux/actions";

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  margin-bottom: 16px;
  font-weight: 500;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 32px;
  }

  p {
    font-size: 16px;
    margin-bottom: 16px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      color: #28a745;
      margin-right: 8px;
      font-weight: 600;
    }
  }
`;

const StyledList = styled(List)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .ant-list-item {
    padding: 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
      background-color: #e6f4ea;
      transform: translateX(5px);
    }
  }

  .ant-list-item-meta-title {
    font-weight: 600;
    color: #28a745;
  }

  .ant-list-item-meta-description {
    color: #555;
  }
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

const PatientDetail = () => {
  const dispatch = useDispatch();
  const patientData = useSelector((state) => state.patient.patient);
  const patients = useSelector((state) => state.patient.patients);
  const error = useSelector((state) => state.patient.error);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const patientId = localStorage.getItem("patient_id");
    if (patientId) {
      dispatch(getPatientDetail(patientId)).catch(() => {
        toast.error(error?.message || "Không lấy được thông tin bệnh nhân!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        if (error?.message === "Lỗi làm mới token") {
          navigate("/login");
        }
      });
      dispatch(getAllPatients()).catch(() => {
        toast.error(error?.message || "Không lấy được danh sách bệnh nhân!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        if (error?.message === "Lỗi làm mới token") {
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, error]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const appointmentData = {
        patient_id: patientData.patient.id,
        doctor_id: values.doctor_id, // Giả sử bạn có danh sách bác sĩ để chọn
        ngay_kham: values.ngay_kham.format("YYYY-MM-DD"),
        gio_kham: values.gio_kham.format("HH:mm:ss"),
        trang_thai: "cho_xac_nhan",
        mo_ta: values.mo_ta,
      };
      await dispatch(createAppointment(appointmentData));
      toast.success("Đặt lịch khám thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsModalVisible(false);
      form.resetFields();
      dispatch(getPatientDetail(patientData.patient.id));
    } catch (err) {
      toast.error(error?.message || "Đặt lịch khám thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const insuranceColumns = [
    { title: "Mã bảo hiểm", dataIndex: "ma_bao_hiem", key: "ma_bao_hiem" },
    { title: "Ngày cấp", dataIndex: "ngay_cap", key: "ngay_cap" },
    { title: "Ngày hết hạn", dataIndex: "ngay_het_han", key: "ngay_het_han" },
    { title: "Nơi cấp", dataIndex: "noi_cap", key: "noi_cap" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Mức hưởng (%)", dataIndex: "muc_huong", key: "muc_huong" },
  ];

  const medicalHistoryColumns = [
    { title: "Ngày khám", dataIndex: "ngay_kham", key: "ngay_kham" },
    { title: "Chẩn đoán", dataIndex: "chan_doan", key: "chan_doan" },
    { title: "Điều trị", dataIndex: "dieu_tri", key: "dieu_tri" },
    { title: "Bác sĩ", dataIndex: "bac_si", key: "bac_si" },
  ];

  const appointmentColumns = [
    { title: "Bác sĩ ID", dataIndex: "doctor_id", key: "doctor_id" },
    { title: "Ngày khám", dataIndex: "ngay_kham", key: "ngay_kham" },
    { title: "Giờ khám", dataIndex: "gio_kham", key: "gio_kham" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
  ];

  if (!patientData)
    return (
      <div style={{ textAlign: "center", margin: "40px", fontSize: "18px" }}>
        Đang tải...
      </div>
    );

  const patient = patientData.patient || {};
  const healthInsurances = patientData.health_insurances || [];
  const medicalHistories = patientData.medical_histories || [];
  const appointments = patientData.appointments || [];

  return (
    <Container>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Thông tin bệnh nhân
      </Title>
      {error && <ErrorText>{error.message}</ErrorText>}
      <StyledCard>
        <p>
          <strong>Tên:</strong> {patient.ten}
        </p>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Ngày sinh:</strong> {patient.ngay_sinh}
        </p>
        <p>
          <strong>Giới tính:</strong> {patient.gioi_tinh}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {patient.so_dt}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {patient.dia_chi}
        </p>
      </StyledCard>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Danh sách bệnh nhân
      </Title>
      <StyledList
        itemLayout="horizontal"
        dataSource={patients}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#28a745" }}
                />
              }
              title={item.ten}
              description={`${item.email} - ${item.ngay_sinh} - ${item.gioi_tinh} - ${item.so_dt}`}
            />
          </List.Item>
        )}
      />
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Danh sách bảo hiểm y tế
      </Title>
      <StyledTable
        columns={insuranceColumns}
        dataSource={healthInsurances}
        rowKey="id"
      />
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Lịch sử khám bệnh
      </Title>
      <StyledTable
        columns={medicalHistoryColumns}
        dataSource={medicalHistories}
        rowKey="id"
      />
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Lịch khám
      </Title>
      <AddButton type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Đặt lịch khám
      </AddButton>
      <StyledTable
        columns={appointmentColumns}
        dataSource={appointments}
        rowKey="id"
      />
      <Modal
        title="Đặt lịch khám"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Bác sĩ ID"
            name="doctor_id"
            rules={[{ required: true, message: "Vui lòng nhập ID bác sĩ!" }]}
          >
            <Input placeholder="ID bác sĩ" />
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
    </Container>
  );
};

export default PatientDetail;
