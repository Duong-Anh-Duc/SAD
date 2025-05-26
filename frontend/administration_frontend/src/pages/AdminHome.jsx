import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  createDoctor,
  createStaff,
  deleteDoctor,
  deleteStaff,
  fetchDoctors,
  fetchStaff,
  updateDoctor,
  updateStaff,
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

const AdminHome = () => {
  const dispatch = useDispatch();
  const { doctors, staff, error } = useSelector((state) => state.admin);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "doctor", "staff"
  const [form] = Form.useForm();
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctors()).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách bác sĩ!");
    });
    dispatch(fetchStaff()).catch(() => {
      toast.error(error?.message || "Không lấy được danh sách nhân viên!");
    });
  }, [dispatch, error]);

  const showModal = (type, record = null) => {
    setModalType(type);
    if (type === "doctor") {
      setEditingDoctor(record);
      if (record) {
        form.setFieldsValue({
          ten: record.ten,
          email: record.email,
          mat_khau: record.mat_khau,
          khoa: record.khoa,
          chuc_vu: record.chuc_vu,
          gioi_thieu: record.gioi_thieu,
          so_dt: record.so_dt,
        });
      } else {
        form.resetFields();
      }
    } else if (type === "staff") {
      setEditingStaff(record);
      if (record) {
        form.setFieldsValue({
          ten: record.ten,
          email: record.email,
          mat_khau: record.mat_khau,
          so_dt: record.so_dt,
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
      if (modalType === "doctor") {
        const doctorData = {
          ten: values.ten,
          email: values.email,
          mat_khau: values.mat_khau,
          khoa: values.khoa,
          chuc_vu: values.chuc_vu,
          gioi_thieu: values.gioi_thieu,
          so_dt: values.so_dt,
        };
        if (editingDoctor) {
          await dispatch(updateDoctor(editingDoctor.id, doctorData));
          toast.success("Cập nhật bác sĩ thành công!");
        } else {
          await dispatch(createDoctor(doctorData));
          toast.success("Thêm bác sĩ thành công!");
        }
        dispatch(fetchDoctors());
      } else if (modalType === "staff") {
        const staffData = {
          ten: values.ten,
          email: values.email,
          mat_khau: values.mat_khau,
          so_dt: values.so_dt,
        };
        if (editingStaff) {
          await dispatch(updateStaff(editingStaff.id, staffData));
          toast.success("Cập nhật nhân viên thành công!");
        } else {
          await dispatch(createStaff(staffData));
          toast.success("Thêm nhân viên thành công!");
        }
        dispatch(fetchStaff());
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

  const handleDeleteDoctor = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa bác sĩ này?",
      onOk: async () => {
        try {
          await dispatch(deleteDoctor(id));
          toast.success("Xóa bác sĩ thành công!");
          dispatch(fetchDoctors());
        } catch (err) {
          toast.error(error?.message || "Xóa bác sĩ thất bại!");
        }
      },
    });
  };

  const handleDeleteStaff = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa nhân viên này?",
      onOk: async () => {
        try {
          await dispatch(deleteStaff(id));
          toast.success("Xóa nhân viên thành công!");
          dispatch(fetchStaff());
        } catch (err) {
          toast.error(error?.message || "Xóa nhân viên thất bại!");
        }
      },
    });
  };

  const doctorColumns = [
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Khoa", dataIndex: "khoa", key: "khoa" },
    { title: "Chức vụ", dataIndex: "chuc_vu", key: "chuc_vu" },
    { title: "Số điện thoại", dataIndex: "so_dt", key: "so_dt" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal("doctor", record)}
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDoctor(record.id)}
          />
        </Space>
      ),
    },
  ];

  const staffColumns = [
    { title: "Tên", dataIndex: "ten", key: "ten" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "so_dt", key: "so_dt" },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal("staff", record)}
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStaff(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Container>
      <Title>Trang chủ quản trị</Title>
      <StyledCard>
        <p>Chào mừng bạn đến với hệ thống quản trị!</p>
      </StyledCard>
      <Title>Quản lý bác sĩ</Title>
      <AddButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal("doctor")}
      >
        Thêm bác sĩ
      </AddButton>
      <StyledTable columns={doctorColumns} dataSource={doctors} rowKey="id" />
      <Title>Quản lý nhân viên</Title>
      <AddButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal("staff")}
      >
        Thêm nhân viên
      </AddButton>
      <StyledTable columns={staffColumns} dataSource={staff} rowKey="id" />
      <Modal
        title={
          modalType === "doctor"
            ? editingDoctor
              ? "Chỉnh sửa bác sĩ"
              : "Thêm bác sĩ"
            : editingStaff
            ? "Chỉnh sửa nhân viên"
            : "Thêm nhân viên"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          {modalType === "doctor" ? (
            <>
              <Form.Item
                label="Tên"
                name="ten"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Tên bác sĩ" />
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
                label="Khoa"
                name="khoa"
                rules={[{ required: true, message: "Vui lòng nhập khoa!" }]}
              >
                <Input placeholder="Khoa" />
              </Form.Item>
              <Form.Item
                label="Chức vụ"
                name="chuc_vu"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
              >
                <Select placeholder="Chọn chức vụ">
                  <Select.Option value="truong_khoa">Trưởng khoa</Select.Option>
                  <Select.Option value="pho_khoa">Phó khoa</Select.Option>
                  <Select.Option value="bac_si">Bác sĩ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Giới thiệu"
                name="gioi_thieu"
                rules={[
                  { required: true, message: "Vui lòng nhập giới thiệu!" },
                ]}
              >
                <Input.TextArea placeholder="Giới thiệu" />
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
            </>
          ) : (
            <>
              <Form.Item
                label="Tên"
                name="ten"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Tên nhân viên" />
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
                label="Số điện thoại"
                name="so_dt"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminHome;
