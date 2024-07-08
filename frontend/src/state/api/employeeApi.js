import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  tagTypes: ['Employees'],
  baseQuery: fetchBaseQuery({ baseUrl: BackendRoutes.BASE }),
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
