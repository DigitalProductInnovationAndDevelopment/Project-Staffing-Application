import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import BackendRoutes from '../../utils/BackendRoutes';
import customFetchBase from "./baseQuery";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['CSRF'],
  // baseQuery: fetchBaseQuery({ baseUrl: BackendRoutes.BASE }),
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
          url: BackendRoutes.LOGIN,
          method: "POST",
          body: { email, password },
          credentials: 'include'
      })
    }),
    logout: builder.mutation({
      query: () => ({
          url: BackendRoutes.LOGOUT,
          method: "POST",
          credentials: 'include',
      }),
  }),
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useLogoutMutation } = authApi;

