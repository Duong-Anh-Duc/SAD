import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080/staff';
const PATIENT_API_GATEWAY_URL = 'http://localhost:8080/patient';
const APPOINTMENT_API_GATEWAY_URL = 'http://localhost:8080/appointment';
const CLINIC_REPORT_API_GATEWAY_URL = 'http://localhost:8080/clinic-report';
const PAYMENT_API_GATEWAY_URL = 'http://localhost:8080/payment';

export const restoreSession = () => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const staffId = localStorage.getItem('staff_id');
    if (accessToken && staffId) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { access_token: accessToken, staff_id: staffId } });
    }
  } catch (error) {
    dispatch({ type: 'LOGOUT_SUCCESS' });
    localStorage.clear();
  }
};

export const registerStaff = (staffData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_GATEWAY_URL}/register/`, staffData);
    if (res && res.status === 201) {
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    } else {
      throw new Error(res.data?.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    dispatch({ type: 'REGISTER_FAIL', payload: error.response?.data || { message: 'Đăng ký thất bại' } });
    throw error;
  }
};

export const loginStaff = (credentials) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_GATEWAY_URL}/login/`, credentials);
    if (res && res.data && res.status === 200) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      localStorage.setItem('access_token', res.data.access_token || '');
      localStorage.setItem('refresh_token', res.data.refresh_token || '');
      localStorage.setItem('staff_id', res.data.staff_id || '');
    } else {
      throw new Error(res.data?.message || 'Phản hồi từ API không hợp lệ');
    }
  } catch (error) {
    dispatch({ type: 'LOGIN_FAIL', payload: error.response?.data || { message: 'Đăng nhập thất bại' } });
    throw error;
  }
};

export const logoutStaff = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken || !refreshToken) {
      throw new Error('Không có token để đăng xuất');
    }
    await axios.post(`${API_GATEWAY_URL}/logout/`, { refresh_token: refreshToken }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    dispatch({ type: 'LOGOUT_SUCCESS' });
    localStorage.clear();
  } catch (error) {
    dispatch({ type: 'LOGOUT_FAIL', payload: error.response?.data || { message: 'Đăng xuất thất bại' } });
  }
};

export const fetchPatients = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${PATIENT_API_GATEWAY_URL}/all/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'FETCH_PATIENTS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_PATIENTS_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách bệnh nhân' } });
    throw error;
  }
};

export const createPatient = (patientData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.post(`${API_GATEWAY_URL}/patient/`, patientData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 201) {
      dispatch({ type: 'CREATE_PATIENT_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Thêm bệnh nhân thất bại');
    }
  } catch (error) {
    dispatch({ type: 'CREATE_PATIENT_FAIL', payload: error.response?.data || { message: 'Thêm bệnh nhân thất bại' } });
    throw error;
  }
};

export const updatePatient = (id, patientData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${API_GATEWAY_URL}/patient/${id}/`, patientData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 200) {
      dispatch({ type: 'UPDATE_PATIENT_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Cập nhật bệnh nhân thất bại');
    }
  } catch (error) {
    dispatch({ type: 'UPDATE_PATIENT_FAIL', payload: error.response?.data || { message: 'Cập nhật bệnh nhân thất bại' } });
    throw error;
  }
};

export const deletePatient = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.delete(`${API_GATEWAY_URL}/patient/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 204) {
      dispatch({ type: 'DELETE_PATIENT_SUCCESS', payload: id });
    } else {
      throw new Error(res.data?.message || 'Xóa bệnh nhân thất bại');
    }
  } catch (error) {
    dispatch({ type: 'DELETE_PATIENT_FAIL', payload: error.response?.data || { message: 'Xóa bệnh nhân thất bại' } });
    throw error;
  }
};

export const fetchHealthInsurances = (patientId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${API_GATEWAY_URL}/health-insurance/?patient_id=${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'FETCH_HEALTH_INSURANCES_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_HEALTH_INSURANCES_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách bảo hiểm' } });
    throw error;
  }
};

export const createHealthInsurance = (insuranceData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.post(`${API_GATEWAY_URL}/health-insurance/`, insuranceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 201) {
      dispatch({ type: 'CREATE_HEALTH_INSURANCE_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Thêm bảo hiểm thất bại');
    }
  } catch (error) {
    dispatch({ type: 'CREATE_HEALTH_INSURANCE_FAIL', payload: error.response?.data || { message: 'Thêm bảo hiểm thất bại' } });
    throw error;
  }
};

export const updateHealthInsurance = (id, insuranceData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${API_GATEWAY_URL}/health-insurance/${id}/`, insuranceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 200) {
      dispatch({ type: 'UPDATE_HEALTH_INSURANCE_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Cập nhật bảo hiểm thất bại');
    }
  } catch (error) {
    dispatch({ type: 'UPDATE_HEALTH_INSURANCE_FAIL', payload: error.response?.data || { message: 'Cập nhật bảo hiểm thất bại' } });
    throw error;
  }
};

export const deleteHealthInsurance = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.delete(`${API_GATEWAY_URL}/health-insurance/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 204) {
      dispatch({ type: 'DELETE_HEALTH_INSURANCE_SUCCESS', payload: id });
    } else {
      throw new Error(res.data?.message || 'Xóa bảo hiểm thất bại');
    }
  } catch (error) {
    dispatch({ type: 'DELETE_HEALTH_INSURANCE_FAIL', payload: error.response?.data || { message: 'Xóa bảo hiểm thất bại' } });
    throw error;
  }
};

export const fetchAppointments = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${APPOINTMENT_API_GATEWAY_URL}/list/`, {
      // headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'FETCH_APPOINTMENTS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_APPOINTMENTS_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách lịch khám' } });
    throw error;
  }
};

export const processAppointment = (id, data) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${APPOINTMENT_API_GATEWAY_URL}/${id}/process/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 200) {
      dispatch({ type: 'PROCESS_APPOINTMENT_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Cập nhật trạng thái cuộc hẹn thất bại');
    }
  } catch (error) {
    dispatch({ type: 'PROCESS_APPOINTMENT_FAIL', payload: error.response?.data || { message: 'Cập nhật trạng thái cuộc hẹn thất bại' } });
    throw error;
  }
};

export const fetchClinicReportsByUser = (userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${CLINIC_REPORT_API_GATEWAY_URL}/list/user/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'FETCH_CLINIC_REPORTS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_CLINIC_REPORTS_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách phiếu kết luận' } });
    throw error;
  }
};

export const fetchPayments = (filters) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${PAYMENT_API_GATEWAY_URL}/list/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    dispatch({ type: 'FETCH_PAYMENTS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_PAYMENTS_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách hóa đơn' } });
    throw error;
  }
};

export const updatePaymentStatus = (id, status) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${PAYMENT_API_GATEWAY_URL}/${id}/update-status/`, { trang_thai: status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 200) {
      dispatch({ type: 'UPDATE_PAYMENT_STATUS_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Cập nhật trạng thái hóa đơn thất bại');
    }
  } catch (error) {
    dispatch({ type: 'UPDATE_PAYMENT_STATUS_FAIL', payload: error.response?.data || { message: 'Cập nhật trạng thái hóa đơn thất bại' } });
    throw error;
  }
};