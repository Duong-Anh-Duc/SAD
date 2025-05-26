const initialState = {
  doctor: null,
  doctors: [],
  error: null,
};

const doctorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
      return { ...state, doctor: action.payload, error: null };
    case 'REGISTER_FAIL':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return { ...state, doctor: action.payload, error: null };
    case 'LOGIN_FAIL':
      return { ...state, error: action.payload };
    case 'LOGOUT_SUCCESS':
      return initialState;
    case 'LOGOUT_FAIL':
      return { ...state, error: action.payload };
    case 'GET_DETAIL_SUCCESS':
      return { ...state, doctor: action.payload, error: null };
    case 'GET_DETAIL_FAIL':
      return { ...state, error: action.payload };
    case 'GET_ALL_SUCCESS':
      return { ...state, doctors: action.payload, error: null };
    case 'GET_ALL_FAIL':
      return { ...state, error: action.payload };
    case 'CONFIRM_APPOINTMENT_SUCCESS':
      return {
        ...state,
        doctor: {
          ...state.doctor,
          appointments: state.doctor.appointments.map(app =>
            app.id === action.payload.id ? action.payload : app
          ),
        },
        error: null,
      };
    case 'CONFIRM_APPOINTMENT_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_CLINIC_REPORT_SUCCESS':
      return { ...state, error: null };
    case 'CREATE_CLINIC_REPORT_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default doctorReducer;