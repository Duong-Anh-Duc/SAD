import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080/administration';
const DOCTOR_API_GATEWAY_URL = 'http://localhost:8080/doctor';
const STAFF_API_GATEWAY_URL = 'http://localhost:8080/staff';

export const restoreSession = () => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const adminId = localStorage.getItem('admin_id');
    if (accessToken && adminId) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { access_token: accessToken, admin_id: adminId } });
    }
  } catch (error) {
    dispatch({ type: 'LOGOUT_SUCCESS' });
    localStorage.clear();
  }
};

export const registerAdmin = (adminData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_GATEWAY_URL}/register/`, adminData);
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

export const loginAdmin = (credentials) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_GATEWAY_URL}/login/`, credentials);
    if (res && res.data && res.status === 200) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      localStorage.setItem('access_token', res.data.access_token || '');
      localStorage.setItem('refresh_token', res.data.refresh_token || '');
      localStorage.setItem('admin_id', res.data.admin_id || '');
    } else {
      throw new Error(res.data?.message || 'Phản hồi từ API không hợp lệ');
    }
  } catch (error) {
    dispatch({ type: 'LOGIN_FAIL', payload: error.response?.data || { message: 'Đăng nhập thất bại' } });
    throw error;
  }
};

export const logoutAdmin = () => async (dispatch) => {
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

export const fetchDoctors = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${API_GATEWAY_URL}/doctor/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'FETCH_DOCTORS_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_DOCTORS_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách bác sĩ' } });
    throw error;
  }
};

export const createDoctor = (doctorData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.post(`${API_GATEWAY_URL}/doctor/`, doctorData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 201) {
      dispatch({ type: 'CREATE_DOCTOR_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Thêm bác sĩ thất bại');
    }
  } catch (error) {
    dispatch({ type: 'CREATE_DOCTOR_FAIL', payload: error.response?.data || { message: 'Thêm bác sĩ thất bại' } });
    throw error;
  }
};

export const updateDoctor = (id, doctorData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${API_GATEWAY_URL}/doctor/${id}/`, doctorData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 200) {
      dispatch({ type: 'UPDATE_DOCTOR_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Cập nhật bác sĩ thất bại');
    }
  } catch (error) {
    dispatch({ type: 'UPDATE_DOCTOR_FAIL', payload: error.response?.data || { message: 'Cập nhật bác sĩ thất bại' } });
    throw error;
  }
};

export const deleteDoctor = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.delete(`${API_GATEWAY_URL}/doctor/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 204) {
      dispatch({ type: 'DELETE_DOCTOR_SUCCESS', payload: id });
    } else {
      throw new Error(res.data?.message || 'Xóa bác sĩ thất bại');
    }
  } catch (error) {
    dispatch({ type: 'DELETE_DOCTOR_FAIL', payload: error.response?.data || { message: 'Xóa bác sĩ thất bại' } });
    throw error;
  }
};

export const fetchStaff = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${API_GATEWAY_URL}/staff/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'FETCH_STAFF_SUCCESS', payload: res.data });
  } catch (error) {
    dispatch({ type: 'FETCH_STAFF_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách nhân viên' } });
    throw error;
  }
};

export const createStaff = (staffData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.post(`${API_GATEWAY_URL}/staff/`, staffData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 201) {
      dispatch({ type: 'CREATE_STAFF_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Thêm nhân viên thất bại');
    }
  } catch (error) {
    dispatch({ type: 'CREATE_STAFF_FAIL', payload: error.response?.data || { message: 'Thêm nhân viên thất bại' } });
    throw error;
  }
};

export const updateStaff = (id, staffData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${API_GATEWAY_URL}/staff/${id}/`, staffData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 200) {
      dispatch({ type: 'UPDATE_STAFF_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Cập nhật nhân viên thất bại');
    }
  } catch (error) {
    dispatch({ type: 'UPDATE_STAFF_FAIL', payload: error.response?.data || { message: 'Cập nhật nhân viên thất bại' } });
    throw error;
  }
};

export const deleteStaff = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.delete(`${API_GATEWAY_URL}/staff/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 204) {
      dispatch({ type: 'DELETE_STAFF_SUCCESS', payload: id });
    } else {
      throw new Error(res.data?.message || 'Xóa nhân viên thất bại');
    }
  } catch (error) {
    dispatch({ type: 'DELETE_STAFF_FAIL', payload: error.response?.data || { message: 'Xóa nhân viên thất bại' } });
    throw error;
  }
};