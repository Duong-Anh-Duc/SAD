import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  createHealthInsurance,
  createPatient,
  deleteHealthInsurance,
  deletePatient,
  fetchAppointments,
  fetchClinicReportsByUser,
  fetchHealthInsurances,
  fetchPatients,
  fetchPayments,
  processAppointment,
  updateHealthInsurance,
  updatePatient,
  updatePaymentStatus,
} from "../redux/actions";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #28a745;
  text-align: center;
  margin-bottom: 24px;
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
    text-align: center;
  }

  p {
    font-size: 16px;
    color: #333;
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

const StaffHome = () => {
  const dispatch = useDispatch();
  const {
    patients,
    healthInsurances,
    appointments,
    clinicReports,
    payments,
    error,
  } = useSelector((state) => state.staff);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "insurance", "patient"
  const [form] = Form.useForm();
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientForReports, setSelectedPatientForReports] =
    useState(null);

  useEffect(() => {
    dispatch(fetchPatients()).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách bệnh nhân!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
    dispatch(fetchAppointments()).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách lịch khám!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
    dispatch(fetchPayments({})).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách hóa đơn!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  }, [dispatch, error]);

  const handlePatientChange = (patientId) => {
    setSelectedPatientId(patientId);
    dispatch(fetchHealthInsurances(patientId)).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách bảo hiểm!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  const showModal = (type, record = null) => {
    setModalType(type);
    if (type === "insurance") {
      setEditingInsurance(record);
      if (record) {
        form.setFieldsValue({
          patient: record.patient,
          ma_bao_hiem: record.ma_bao_hiem,
          ngay_cap: moment(record.ngay_cap),
          ngay_het_han: moment(record.ngay_het_han),
          noi_cap: record.noi_cap,
          trang_thai: record.trang_thai,
          muc_huong: record.muc_huong,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ patient: selectedPatientId });
      }
    } else if (type === "patient") {
      setEditingPatient(record);
      if (record) {
        form.setFieldsValue({
          ten: record.ten,
          email: record.email,
          mat_khau: record.mat_khau,
          ngay_sinh: moment(record.ngay_sinh),
          gioi_tinh: record.gioi_tinh,
          so_dt: record.so_dt,
          dia_chi: record.dia_chi,
        });
      } else {
        form.resetFields();
      }
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === "insurance") {
        const insuranceData = {
          patient: values.patient,
          ma_bao_hiem: values.ma_bao_hiem,
          ngay_cap: values.ngay_cap.format("YYYY-MM-DD"),
          ngay_het_han: values.ngay_het_han.format("YYYY-MM-DD"),
          noi_cap: values.noi_cap,
          trang_thai: values.trang_thai,
          muc_huong: values.muc_huong,
        };
        if (editingInsurance) {
          await dispatch(
            updateHealthInsurance(editingInsurance.id, insuranceData)
          );
          toast.success("Cập nhật bảo hiểm thành công!");
        } else {
          await dispatch(createHealthInsurance(insuranceData));
          toast.success("Thêm bảo hiểm thành công!");
        }
        dispatch(fetchHealthInsurances(selectedPatientId));
      } else if (modalType === "patient") {
        const patientData = {
          ten: values.ten,
          email: values.email,
          mat_khau: values.mat_khau,
          ngay_sinh: values.ngay_sinh.format("YYYY-MM-DD"),
          gioi_tinh: values.gioi_tinh,
          so_dt: values.so_dt,
          dia_chi: values.dia_chi,
        };
        if (editingPatient) {
          await dispatch(updatePatient(editingPatient.id, patientData));
          toast.success("Cập nhật bệnh nhân thành công!");
        } else {
          await dispatch(createPatient(patientData));
          toast.success("Thêm bệnh nhân thành công!");
        }
        dispatch(fetchPatients());
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (err) {
      toast.error(error?.message || "Thao tác thất bại!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteInsurance = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa bảo hiểm này?",
      onOk: async () => {
        try {
          await dispatch(deleteHealthInsurance(id));
          toast.success("Xóa bảo hiểm thành công!");
          dispatch(fetchHealthInsurances(selectedPatientId));
        } catch (err) {
          toast.error(error?.message || "Xóa bảo hiểm thất bại!");
        }
      },
    });
  };

  const handleDeletePatient = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa bệnh nhân này?",
      onOk: async () => {
        try {
          await dispatch(deletePatient(id));
          toast.success("Xóa bệnh nhân thành công!");
          dispatch(fetchPatients());
        } catch (err) {
          toast.error(error?.message || "Xóa bệnh nhân thất bại!");
        }
      },
    });
  };

  const handleProcessAppointment = (id, status) => {
    dispatch(processAppointment(id, { trang_thai: status }))
      .then(() => {
        toast.success("Cập nhật trạng thái cuộc hẹn thành công!");
        dispatch(fetchAppointments());
      })
      .catch(() => {
        toast.error(error?.message || "Cập nhật trạng thái cuộc hẹn thất bại!");
      });
  };

  const handleViewReports = (patientId) => {
    setSelectedPatientForReports(patientId);
    dispatch(fetchClinicReportsByUser(patientId)).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách phiếu kết luận!");
    });
  };

  const handleUpdatePaymentStatus = (id, status) => {
    dispatch(updatePaymentStatus(id, status))
      .then(() => {
        toast.success("Cập nhật trạng thái hóa đơn thành công!");
        dispatch(fetchPayments({}));
      })
      .catch(() => {
        toast.error(error?.message || "Cập nhật trạng thái hóa đơn thất bại!");
      });
  };

  const patientColumns = [
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Ngày sinh", dataIndex: "ngay_sinh", key: "ngay_sinh" },
    { title: "Giới tính", dataIndex: "gioi_tinh", key: "gioi_tinh" },
    { title: "Số điện thoại", dataIndex: "so_dt", key: "so_dt" },
    { title: "Địa chỉ", dataIndex: "dia_chi", key: "dia_chi" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal("patient", record)}
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePatient(record.id)}
          />
        </Space>
      ),
    },
    {
      title: "Phiếu kết luận",
      key: "reports",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleViewReports(record.id)}>
          Xem phiếu kết luận
        </Button>
      ),
    },
  ];

  const insuranceColumns = [
    { title: "Mã bảo hiểm", dataIndex: "ma_bao_hiem", key: "ma_bao_hiem" },
    { title: "Ngày cấp", dataIndex: "ngay_cap", key: "ngay_cap" },
    { title: "Ngày hết hạn", dataIndex: "ngay_het_han", key: "ngay_het_han" },
    { title: "Nơi cấp", dataIndex: "noi_cap", key: "noi_cap" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Mức hưởng (%)", dataIndex: "muc_huong", key: "muc_huong" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal("insurance", record)}
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteInsurance(record.id)}
          />
        </Space>
      ),
    },
  ];

  const appointmentColumns = [
    { title: "Bệnh nhân ID", dataIndex: "patient_id", key: "patient_id" },
    { title: "Bác sĩ ID", dataIndex: "doctor_id", key: "doctor_id" },
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
            <>
              <Button
                type="primary"
                onClick={() =>
                  handleProcessAppointment(record.id, "da_xac_nhan")
                }
              >
                Xác nhận
              </Button>
              <Button
                type="danger"
                onClick={() => handleProcessAppointment(record.id, "da_huy")}
              >
                Hủy
              </Button>
            </>
          )}
          {record.trang_thai === "da_xac_nhan" && (
            <Button
              type="danger"
              onClick={() => handleProcessAppointment(record.id, "da_huy")}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const clinicReportColumns = [
    { title: "Kết luận", dataIndex: "ket_luan", key: "ket_luan" },
    { title: "Chẩn đoán", dataIndex: "chan_doan", key: "chan_doan" },
    { title: "Điều trị", dataIndex: "dieu_tri", key: "dieu_tri" },
    { title: "Ghi chú", dataIndex: "ghi_chu", key: "ghi_chu" },
    { title: "Ngày tạo", dataIndex: "created_at", key: "created_at" },
  ];

  const paymentColumns = [
    { title: "Bệnh nhân ID", dataIndex: "patient_id", key: "patient_id" },
    { title: "Số tiền", dataIndex: "so_tien", key: "so_tien" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Phương thức", dataIndex: "phuong_thuc", key: "phuong_thuc" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record.trang_thai === "chua_thanh_toan" && (
            <>
              <Button
                type="primary"
                onClick={() =>
                  handleUpdatePaymentStatus(record.id, "da_thanh_toan")
                }
              >
                Thanh toán
              </Button>
              <Button
                type="danger"
                onClick={() => handleUpdatePaymentStatus(record.id, "huy")}
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <Title>Trang chủ nhân viên</Title>
      <StyledCard>
        <p>Chào mừng bạn đến với hệ thống nhân viên!</p>
      </StyledCard>
      <Title>Quản lý bệnh nhân</Title>
      <AddButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal("patient")}
      >
        Thêm bệnh nhân
      </AddButton>
      <StyledTable columns={patientColumns} dataSource={patients} rowKey="id" />
      <Title>Quản lý bảo hiểm y tế</Title>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="Chọn bệnh nhân">
          <Select
            placeholder="Chọn bệnh nhân"
            onChange={handlePatientChange}
            style={{ width: 200 }}
          >
            {patients.map((patient) => (
              <Select.Option key={patient.id} value={patient.id}>
                {patient.ten}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      {selectedPatientId && (
        <>
          <AddButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal("insurance")}
          >
            Thêm bảo hiểm
          </AddButton>
          <StyledTable
            columns={insuranceColumns}
            dataSource={healthInsurances}
            rowKey="id"
          />
        </>
      )}
      <Title>Quản lý lịch khám</Title>
      <StyledTable
        columns={appointmentColumns}
        dataSource={appointments}
        rowKey="id"
      />
      <Title>Phiếu kết luận của bệnh nhân</Title>
      {selectedPatientForReports && (
        <StyledTable
          columns={clinicReportColumns}
          dataSource={clinicReports}
          rowKey="id"
        />
      )}
      <Title>Danh sách hóa đơn</Title>
      <StyledTable columns={paymentColumns} dataSource={payments} rowKey="id" />
      <Modal
        title={
          modalType === "insurance"
            ? editingInsurance
              ? "Chỉnh sửa bảo hiểm"
              : "Thêm bảo hiểm"
            : editingPatient
            ? "Chỉnh sửa bệnh nhân"
            : "Thêm bệnh nhân"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          {modalType === "insurance" ? (
            <>
              <Form.Item
                label="Bệnh nhân"
                name="patient"
                rules={[
                  { required: true, message: "Vui lòng chọn bệnh nhân!" },
                ]}
              >
                <Select placeholder="Chọn bệnh nhân" disabled>
                  {patients.map((patient) => (
                    <Select.Option key={patient.id} value={patient.id}>
                      {patient.ten}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Mã bảo hiểm"
                name="ma_bao_hiem"
                rules={[
                  { required: true, message: "Vui lòng nhập mã bảo hiểm!" },
                ]}
              >
                <Input placeholder="Mã bảo hiểm" />
              </Form.Item>
              <Form.Item
                label="Ngày cấp"
                name="ngay_cap"
                rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Ngày hết hạn"
                name="ngay_het_han"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hết hạn!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Nơi cấp"
                name="noi_cap"
                rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
              >
                <Input placeholder="Nơi cấp" />
              </Form.Item>
              <Form.Item
                label="Trạng thái"
                name="trang_thai"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="con_hieu_luc">
                    Còn hiệu lực
                  </Select.Option>
                  <Select.Option value="het_han">Hết hạn</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Mức hưởng (%)"
                name="muc_huong"
                rules={[
                  { required: true, message: "Vui lòng nhập mức hưởng!" },
                ]}
              >
                <Input type="number" placeholder="Mức hưởng" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="Tên"
                name="ten"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Tên bệnh nhân" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="mat_khau"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item
                label="Ngày sinh"
                name="ngay_sinh"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gioi_tinh"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="so_dt"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
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
            </>
          )}
        </Form>
      </Modal>
    </Container>
  );
};

export default StaffHome;
