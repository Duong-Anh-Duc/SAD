import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './reducers';

export const store = configureStore({
  reducer: {
    doctor: doctorReducer,
  },
});