import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";

export const projectApi = createApi({
    reducerPath: "projectApi",
    tagTypes: ['Projects'],
    baseQuery: fetchBaseQuery({ baseUrl: BackendRoutes.BASE }),
    endpoints: (builder) => ({
        getAllProjects: builder.query({
            query: () => ({
                url: BackendRoutes.GET_ALL_PROJECTS,
                credentials: 'include',
            }),
            providesTags: (result, error, arg) => [{type: 'Projects', id: 'LIST'}],
            transformResponse: (result) => {
                //console.log("Projects API Response:", result); //log the API response
                return result;
            },
        })
    }),
});
