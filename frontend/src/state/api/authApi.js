import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import BackendRoutes from '../../utils/BackendRoutes';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['CSRF'],
  baseQuery: fetchBaseQuery({ baseUrl: BackendRoutes.BASE }),
//   baseQuery: customFetchBase,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: BackendRoutes.LOGIN,
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = authApi;

