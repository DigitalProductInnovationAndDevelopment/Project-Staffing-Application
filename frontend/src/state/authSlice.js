import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  loginRequired: false,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.loggedIn = action.payload.loggedIn;
    },
    setLoginRequired: (state, action) => {
      state.loginRequired = action.payload.loginRequired;
      state.loggedIn = action.payload.loginRequired;
    },
  },
});

export const { setLogin, setLoginRequired } = authSlice.actions;

export default authSlice.reducer;
