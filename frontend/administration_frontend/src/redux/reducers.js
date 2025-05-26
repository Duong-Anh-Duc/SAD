const initialState = {
  admin: null,
  doctors: [],
  staff: [],
  error: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
      return { ...state, admin: action.payload, error: null };
    case 'REGISTER_FAIL':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return { ...state, admin: action.payload, error: null };
    case 'LOGIN_FAIL':
      return { ...state, error: action.payload };
    case 'LOGOUT_SUCCESS':
      return initialState;
    case 'LOGOUT_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_DOCTORS_SUCCESS':
      return { ...state, doctors: action.payload, error: null };
    case 'FETCH_DOCTORS_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_DOCTOR_SUCCESS':
      return { ...state, doctors: [...state.doctors, action.payload], error: null };
    case 'CREATE_DOCTOR_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_DOCTOR_SUCCESS':
      return {
        ...state,
        doctors: state.doctors.map(doctor =>
          doctor.id === action.payload.id ? action.payload : doctor
        ),
        error: null
      };
    case 'UPDATE_DOCTOR_FAIL':
      return { ...state, error: action.payload };
    case 'DELETE_DOCTOR_SUCCESS':
      return {
        ...state,
        doctors: state.doctors.filter(doctor => doctor.id !== action.payload),
        error: null
      };
    case 'DELETE_DOCTOR_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_STAFF_SUCCESS':
      return { ...state, staff: action.payload, error: null };
    case 'FETCH_STAFF_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_STAFF_SUCCESS':
      return { ...state, staff: [...state.staff, action.payload], error: null };
    case 'CREATE_STAFF_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_STAFF_SUCCESS':
      return {
        ...state,
        staff: state.staff.map(staffMember =>
          staffMember.id === action.payload.id ? action.payload : staffMember
        ),
        error: null
      };
    case 'UPDATE_STAFF_FAIL':
      return { ...state, error: action.payload };
    case 'DELETE_STAFF_SUCCESS':
      return {
        ...state,
        staff: state.staff.filter(staffMember => staffMember.id !== action.payload),
        error: null
      };
    case 'DELETE_STAFF_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default adminReducer;