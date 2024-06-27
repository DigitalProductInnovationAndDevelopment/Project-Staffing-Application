// src/state/store.js
import { configureStore } from '@reduxjs/toolkit';
import { projectApi } from './api/projectApi';
import { employeeApi } from './api/employeeApi';

export const store = configureStore({
  reducer: {
    [projectApi.reducerPath]: projectApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectApi.middleware, employeeApi.middleware),
});
