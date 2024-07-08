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
        createNewUser: builder.mutation({
          query: (newUserData) => ({
            url: BackendRoutes.CREATE_NEW_USER,
            method: 'POST',
            body: newUserData,
          }),
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: BackendRoutes.DELETE_USER(userId),
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation, useCreateNewUserMutation, useDeleteUserMutation} = userApi;
