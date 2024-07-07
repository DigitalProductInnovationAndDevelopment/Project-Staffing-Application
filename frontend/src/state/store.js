import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';
// import APIs
import { authSlice } from './authSlice';
import { projectApi } from './api/projectApi';
import { employeeApi } from './api/employeeApi';
import { userApi } from './api/userApi';
import { authApi } from './api/authApi';

// combine multiple reducers into one
const rootReducer = combineReducers({
  // local state bzw. local storage
  authSlice: authSlice.reducer, // persistente local state veränderungen (wird nach browser-reload beibehalten), e.g.: remember-me, dark mode
  [projectApi.reducerPath]: projectApi.reducer, // nicht persistente local state veränderungen durch rtk.query / rtk.mutation (wird nach browser-reload gelöscht)
  [employeeApi.reducerPath]: employeeApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

//Need to blacklist the RTK-Query APIs from the persistence store
//https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
/* It is also strongly recommended to blacklist any api(s) that you have configured with RTK Query.
   If the api slice reducer is not blacklisted, the api cache will be automatically persisted and
   restored which could leave you with phantom subscriptions from components that do not exist any more.
*/
const persistConfig = {
  key: 'root',
  storage,
  blacklist: [authApi.reducerPath, projectApi.reducerPath, employeeApi.reducerPath, userApi.reducerPath],
};

// wraps the root reducer with persistReducer using the persistConfig.
// this ensures that the state managed by the root reducer is persisted according to the configuration
const persistedReducer = (reducer) => {
  return persistReducer(persistConfig, reducer);
};

export const store = configureStore({
  reducer: persistedReducer(rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {ignoreActions: [REHYDRATE]},
    })
      .concat(thunk)
      .concat(authApi.middleware)
      .concat(projectApi.middleware)
      .concat(employeeApi.middleware)
      .concat(userApi.middleware)
});

export const persistor = persistStore(store);
