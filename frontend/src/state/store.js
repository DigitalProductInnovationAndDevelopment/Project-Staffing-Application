// src/state/store.js
import { configureStore } from '@reduxjs/toolkit';
import { projectApi } from './api/projectApi';
import { employeeApi } from './api/employeeApi';
import { userApi } from './api/userApi';

export const store = configureStore({
  reducer: {
    [projectApi.reducerPath]: projectApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectApi.middleware, employeeApi.middleware, userApi.middleware),
});
