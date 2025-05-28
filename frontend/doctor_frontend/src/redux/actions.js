import axios from 'axios';
import { toast } from 'react-toastify';

const API_GATEWAY_URL = 'http://localhost:8080/doctor';
const APPOINTMENT_API_GATEWAY_URL = 'http://localhost:8080/appointment';
const CLINIC_REPORT_API_GATEWAY_URL = 'http://localhost:8080/clinic-report';

export const restoreSession = () => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const doctorId = localStorage.getItem('doctor_id');
    if (accessToken && doctorId) {
      const res = await axios.get(`${API_GATEWAY_URL}/detail/${doctorId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      dispatch({ type: 'LOGIN_SUCCESS', payload: { access_token: accessToken, doctor_id: doctorId, ...res.data } });
    }
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const refreshRes = await axios.post(`${API_GATEWAY_URL}/token/refresh/`, { refresh: refreshToken });
        if (refreshRes && refreshRes.data && refreshRes.data.access) {
          localStorage.setItem('access_token', refreshRes.data.access);
          const retryRes = await axios.get(`${API_GATEWAY_URL}/detail/${doctorId}/`, {
            headers: { Authorization: `Bearer ${refreshRes.data.access}` }
          });
          dispatch({ type: 'LOGIN_SUCCESS', payload: { access_token: refreshRes.data.access, doctor_id: doctorId, ...retryRes.data } });
        } else {
          throw new Error('Không thể làm mới token');
        }
      } catch (refreshError) {
        dispatch({ type: 'LOGOUT_SUCCESS' });
        localStorage.clear();
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
      }
    } else {
      dispatch({ type: 'LOGOUT_SUCCESS' });
      localStorage.clear();
    }
  }
};

export const registerDoctor = (doctorData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_GATEWAY_URL}/register/`, doctorData);
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

export const loginDoctor = (credentials) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_GATEWAY_URL}/login/`, credentials);
    if (res && res.data && res.status === 200) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      localStorage.setItem('access_token', res.data.access_token || '');
      localStorage.setItem('refresh_token', res.data.refresh_token || '');
      localStorage.setItem('doctor_id', res.data.doctor_id || '');
    } else {
      throw new Error(res.data?.message || 'Phản hồi từ API không hợp lệ');
    }
  } catch (error) {
    dispatch({ type: 'LOGIN_FAIL', payload: error.response?.data || { message: 'Đăng nhập thất bại' } });
    throw error;
  }
};

export const logoutDoctor = () => async (dispatch) => {
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

export const getDoctorDetail = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${API_GATEWAY_URL}/detail/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const appointmentsRes = await axios.get(`${APPOINTMENT_API_GATEWAY_URL}/doctor/${id}/`);
    dispatch({ type: 'GET_DETAIL_SUCCESS', payload: { ...res.data, appointments: appointmentsRes.data } });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const refreshRes = await axios.post(`${API_GATEWAY_URL}/token/refresh/`, { refresh: refreshToken });
        if (refreshRes && refreshRes.data && refreshRes.data.access) {
          localStorage.setItem('access_token', refreshRes.data.access);
          const retryRes = await axios.get(`${API_GATEWAY_URL}/detail/${id}/`, {
            headers: { Authorization: `Bearer ${refreshRes.data.access}` }
          });
          const appointmentsRetryRes = await axios.get(`${APPOINTMENT_API_GATEWAY_URL}/doctor/${id}/`);
          dispatch({ type: 'GET_DETAIL_SUCCESS', payload: { ...retryRes.data, appointments: appointmentsRetryRes.data } });
        } else {
          throw new Error('Không thể làm mới token');
        }
      } catch (refreshError) {
        dispatch({ type: 'GET_DETAIL_FAIL', payload: refreshError.response?.data || { message: 'Lỗi làm mới token' } });
        localStorage.clear();
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
      }
    } else {
      dispatch({ type: 'GET_DETAIL_FAIL', payload: error.response?.data || { message: 'Không lấy được thông tin' } });
    }
  }
};

export const getAllDoctors = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.get(`${API_GATEWAY_URL}/all/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: 'GET_ALL_SUCCESS', payload: res.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const refreshRes = await axios.post(`${API_GATEWAY_URL}/token/refresh/`, { refresh: refreshToken });
        if (refreshRes && refreshRes.data && refreshRes.data.access) {
          localStorage.setItem('access_token', refreshRes.data.access);
          const retryRes = await axios.get(`${API_GATEWAY_URL}/all/`, {
            headers: { Authorization: `Bearer ${refreshRes.data.access}` }
          });
          dispatch({ type: 'GET_ALL_SUCCESS', payload: retryRes.data });
        } else {
          throw new Error('Không thể làm mới token');
        }
      } catch (refreshError) {
        dispatch({ type: 'GET_ALL_FAIL', payload: refreshError.response?.data || { message: 'Lỗi làm mới token' } });
        localStorage.clear();
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
      }
    } else {
      dispatch({ type: 'GET_ALL_FAIL', payload: error.response?.data || { message: 'Không lấy được danh sách' } });
    }
  }
};

export const confirmAppointment = (id, data) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.put(`${APPOINTMENT_API_GATEWAY_URL}/${id}/process/`, data);
    if (res && res.status === 200) {
      dispatch({ type: 'CONFIRM_APPOINTMENT_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Xác nhận lịch khám thất bại');
    }
  } catch (error) {
    dispatch({ type: 'CONFIRM_APPOINTMENT_FAIL', payload: error.response?.data || { message: 'Xác nhận lịch khám thất bại' } });
    throw error;
  }
};

export const createClinicReport = (reportData) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Không có token để xác thực');
    const res = await axios.post(`${CLINIC_REPORT_API_GATEWAY_URL}/create/`, reportData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res && res.status === 201) {
      dispatch({ type: 'CREATE_CLINIC_REPORT_SUCCESS', payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || 'Tạo phiếu kết luận thất bại');
    }
  } catch (error) {
    dispatch({ type: 'CREATE_CLINIC_REPORT_FAIL', payload: error.response?.data || { message: 'Tạo phiếu kết luận thất bại' } });
    throw error;
  }
};