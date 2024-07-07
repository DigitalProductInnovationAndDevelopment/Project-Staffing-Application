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
        }),
        getProjectById: builder.query({
            query: (projectId) => ({
                url: BackendRoutes.GET_PROJECT_BY_ID(projectId),
                credentials: 'include',
            }),
        }),
        updateProject: builder.mutation({
          query: ({ projectId, patchData }) => ({
            url: BackendRoutes.UPDATE_PROJECT(projectId),
            method: 'PATCH',
            body: patchData,
          }),
        }),
        createProject: builder.mutation({
          query: ( payload ) => ({
            url: BackendRoutes.CREATE_NEW_PROJECT,
            method: 'POST',
            body: payload,
          })
        }),
    }),
});

export const {useGetProjectByIdQuery, useUpdateProjectMutation, useCreateProjectMutation} = projectApi;