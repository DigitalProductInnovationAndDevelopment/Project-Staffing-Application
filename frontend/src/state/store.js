// src/state/store.js
import { configureStore } from '@reduxjs/toolkit';
import { projectApi } from './api/projectApi';

export const store = configureStore({
  reducer: {
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(projectApi.middleware),
});
