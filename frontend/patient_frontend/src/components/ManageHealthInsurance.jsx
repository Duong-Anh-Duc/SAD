import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  createHealthInsurance,
  deleteHealthInsurance,
  getHealthInsurances,
  updateHealthInsurance,
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
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #28a745;
    color: white;
  }
`;

const AddButton = styled(Button)`
  background: #28a745;
  border-color: #28a745;
  color: white;
  border-radius: 10px;
  margin-bottom: 16px;

  &:hover {
    background: #218838;
    border-color: #218838;
  }
`;

const ManageHealthInsurance = () => {
  const dispatch = useDispatch();
  const patient = useSelector((state) => state.patient.patient);
  const insurances = useSelector((state) => state.patient.health_insurances);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(null);

  useEffect(() => {
    if (patient?.patient?.id) {
      dispatch(getHealthInsurances(patient.patient.id));
    }
  }, [dispatch, patient]);

  const showModal = (insurance = null) => {
    setEditingInsurance(insurance);
    if (insurance) {
      form.setFieldsValue({
        ma_bao_hiem: insurance.ma_bao_hiem,
        ngay_cap: insurance.ngay_cap ? moment(insurance.ngay_cap) : null,
        ngay_het_han: insurance.ngay_het_han
          ? moment(insurance.ngay_het_han)
          : null,
        noi_cap: insurance.noi_cap,
        muc_huong: insurance.muc_huong,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const insuranceData = {
        patient: patient.patient.id,
        ma_bao_hiem: values.ma_bao_hiem,
        ngay_cap: values.ngay_cap.format("YYYY-MM-DD"),
        ngay_het_han: values.ngay_het_han.format("YYYY-MM-DD"),
        noi_cap: values.noi_cap,
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
      setIsModalVisible(false);
      form.resetFields();
      dispatch(getHealthInsurances(patient.patient.id));
    } catch (error) {
      toast.error("Thao tác thất bại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteHealthInsurance(id));
      toast.success("Xóa bảo hiểm thành công!");
      dispatch(getHealthInsurances(patient.patient.id));
    } catch (error) {
      toast.error("Xóa bảo hiểm thất bại!");
    }
  };

  const columns = [
    { title: "Mã bảo hiểm", dataIndex: "ma_bao_hiem", key: "ma_bao_hiem" },
    { title: "Ngày cấp", dataIndex: "ngay_cap", key: "ngay_cap" },
    { title: "Ngày hết hạn", dataIndex: "ngay_het_han", key: "ngay_het_han" },
    { title: "Nơi cấp", dataIndex: "noi_cap", key: "noi_cap" },
    { title: "Mức hưởng (%)", dataIndex: "muc_huong", key: "muc_huong" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Title>Quản lý bảo hiểm y tế</Title>
      <AddButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
      >
        Thêm bảo hiểm
      </AddButton>
      <StyledTable columns={columns} dataSource={insurances} rowKey="id" />
      <Modal
        title={editingInsurance ? "Sửa bảo hiểm" : "Thêm bảo hiểm"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã bảo hiểm"
            name="ma_bao_hiem"
            rules={[{ required: true, message: "Vui lòng nhập mã bảo hiểm!" }]}
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
            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
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
            label="Mức hưởng (%)"
            name="muc_huong"
            rules={[{ required: true, message: "Vui lòng nhập mức hưởng!" }]}
          >
            <Input type="number" placeholder="Mức hưởng" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageHealthInsurance;
