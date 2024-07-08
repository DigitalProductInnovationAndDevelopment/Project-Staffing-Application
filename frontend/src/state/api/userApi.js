import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: BackendRoutes.BASE }),
    endpoints: (builder) => ({
        getUserById: builder.query({
            query: (userId) => ({
                url: BackendRoutes.GET_USER_BY_ID(userId),
                credentials: 'include',
            }),
        }),
        updateUser: builder.mutation({
          query: ({ userId, patchData }) => ({
            url: BackendRoutes.UPDATE_USER(userId),
            method: 'PATCH',
            body: patchData,
          }),
        }),
    }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation} = userApi;
