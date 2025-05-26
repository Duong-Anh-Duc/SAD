import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  Modal,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  confirmAppointment,
  createClinicReport,
  getAllDoctors,
  getDoctorDetail,
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

const DoctorDetail = () => {
  const dispatch = useDispatch();
  const doctorData = useSelector((state) => state.doctor.doctor);
  const doctors = useSelector((state) => state.doctor.doctors);
  const error = useSelector((state) => state.doctor.error);
  const navigate = useNavigate();
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reportForm] = Form.useForm();

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");
    if (doctorId) {
      dispatch(getDoctorDetail(doctorId)).catch(() => {
        toast.error(error?.message || "Không lấy được thông tin bác sĩ!", {
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
      dispatch(getAllDoctors()).catch(() => {
        toast.error(error?.message || "Không lấy được danh sách bác sĩ!", {
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

  const handleConfirm = (id) => {
    dispatch(confirmAppointment(id, { trang_thai: "da_xac_nhan" }))
      .then(() => {
        toast.success("Xác nhận lịch khám thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        dispatch(getDoctorDetail(doctorData.doctor.id));
      })
      .catch(() => {
        toast.error(error?.message || "Xác nhận lịch khám thất bại!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const showReportModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsReportModalVisible(true);
  };

  const handleReportOk = async () => {
    try {
      const values = await reportForm.validateFields();
      const reportData = {
        appointment_id: selectedAppointment.id,
        patient_id: selectedAppointment.patient_id,
        doctor_id: doctorData.doctor.id,
        ket_luan: values.ket_luan,
        chan_doan: values.chan_doan,
        dieu_tri: values.dieu_tri,
        ghi_chu: values.ghi_chu,
      };
      await dispatch(createClinicReport(reportData));
      toast.success("Tạo phiếu kết luận thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsReportModalVisible(false);
      reportForm.resetFields();
      await dispatch(
        confirmAppointment(selectedAppointment.id, { trang_thai: "hoan_thanh" })
      );
      dispatch(getDoctorDetail(doctorData.doctor.id));
    } catch (err) {
      toast.error(error?.message || "Tạo phiếu kết luận thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleReportCancel = () => {
    setIsReportModalVisible(false);
    reportForm.resetFields();
  };

  const appointmentColumns = [
    { title: "Bệnh nhân ID", dataIndex: "patient_id", key: "patient_id" },
    { title: "Ngày khám", dataIndex: "ngay_kham", key: "ngay_kham" },
    { title: "Giờ khám", dataIndex: "gio_kham", key: "gio_kham" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record.trang_thai === "cho_xac_nhan" && (
            <Button type="primary" onClick={() => handleConfirm(record.id)}>
              Xác nhận
            </Button>
          )}
          {record.trang_thai === "da_xac_nhan" && (
            <Button type="primary" onClick={() => showReportModal(record)}>
              Tạo phiếu kết luận
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (!doctorData)
    return (
      <div style={{ textAlign: "center", margin: "40px", fontSize: "18px" }}>
        Đang tải...
      </div>
    );

  const doctor = doctorData.doctor || {};
  const appointments = doctorData.appointments || [];

  return (
    <Container>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Thông tin bác sĩ
      </Title>
      {error && <ErrorText>{error.message}</ErrorText>}
      <StyledCard>
        <p>
          <strong>Tên:</strong> {doctor.ten}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Khoa:</strong> {doctor.khoa}
        </p>
        <p>
          <strong>Chức vụ:</strong> {doctor.chuc_vu}
        </p>
        <p>
          <strong>Giới thiệu:</strong> {doctor.gioi_thieu}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {doctor.so_dt}
        </p>
      </StyledCard>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Danh sách bác sĩ
      </Title>
      <StyledList
        itemLayout="horizontal"
        dataSource={doctors}
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
              description={`${item.email} - ${item.khoa} - ${item.chuc_vu} - ${item.so_dt}`}
            />
          </List.Item>
        )}
      />
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Lịch khám
      </Title>
      <StyledTable
        columns={appointmentColumns}
        dataSource={appointments}
        rowKey="id"
      />
      <Modal
        title="Tạo phiếu kết luận"
        visible={isReportModalVisible}
        onOk={handleReportOk}
        onCancel={handleReportCancel}
      >
        <Form form={reportForm} layout="vertical">
          <Form.Item
            label="Kết luận"
            name="ket_luan"
            rules={[{ required: true, message: "Vui lòng nhập kết luận!" }]}
          >
            <Input.TextArea placeholder="Kết luận khám" />
          </Form.Item>
          <Form.Item
            label="Chẩn đoán"
            name="chan_doan"
            rules={[{ required: true, message: "Vui lòng nhập chẩn đoán!" }]}
          >
            <Input.TextArea placeholder="Chẩn đoán" />
          </Form.Item>
          <Form.Item
            label="Điều trị"
            name="dieu_tri"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập phương pháp điều trị!",
              },
            ]}
          >
            <Input.TextArea placeholder="Phương pháp điều trị" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="ghi_chu">
            <Input.TextArea placeholder="Ghi chú" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default DoctorDetail;
