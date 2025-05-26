import { configureStore } from '@reduxjs/toolkit';
import staffReducer from './reducers';

export const store = configureStore({
  reducer: {
    staff: staffReducer,
  },
});