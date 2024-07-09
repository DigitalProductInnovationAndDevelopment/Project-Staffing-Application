import {createApi} from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";
import customFetchBase from "./baseQuery";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  tagTypes: ['Employees'],
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: () => ({
        url: BackendRoutes.GET_ALL_USERS,
        credentials: 'include',
      }),
      providesTags: (result, error, arg) => [{ type: 'Employees', id: 'LIST' }],
      transformResponse: (result) => {
        //console.log("Employees API Response:", result); //log the API response
        return result;
      },
    }),
  }),
});

export const { useGetAllEmployeesQuery } = employeeApi;
