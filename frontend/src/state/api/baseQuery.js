import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import BackendRoutes from '../../utils/BackendRoutes';
import { setLoginRequired } from '../authSlice';
// import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: BackendRoutes.BASE,
  credentials: 'include',
  // prepareHeaders: (headers) => {
  //     const csrfToken = Cookies.get('X-XSRF-TOKEN'); // Retrieve the CSRF token from your application

  //     // Include the CSRF token header in the request
  //     headers.set('X-XSRF-Token', csrfToken);

  //     return headers;
  // },
});

const customFetchBase = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const loggedIn = api.getState().authSlice.loggedIn;

  if (result.error && result.error.status) {
    const { status } = result.meta.response;

    // force user to login again if 401 or 403 (unauthorized or forbidden)
    if (loggedIn && (status === 401 || status === 403)) {
      api.dispatch(setLoginRequired({ loginRequired: true, loggedIn: false }));
    }
  }

  return result;
};

export default customFetchBase;
