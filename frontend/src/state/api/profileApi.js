import {createApi} from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";
import customFetchBase from "./baseQuery";

export const profileApi = createApi({
    reducerPath: "profileApi",
    tagTypes: ['Profiles'],
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getProfilesByProjectId: builder.query({
            query: (projectId) => ({
                url: BackendRoutes.GET_ALL_PROFILES_BY_PROJECT_ID(projectId),
                credentials: 'include',
            }),
        }),
        getProfileById: builder.query({
          query: (projectId, profileId) => ({
            url: BackendRoutes.GET_PROFILE_BY_ID(projectId, profileId),
            credentials: 'include',
          }),
        }),
        createProfileForProject: builder.mutation({
          query: ({ projectId, payload }) => ({
            url: BackendRoutes.CREATE_NEW_PROFILE(projectId),
            method: 'POST',
            body: payload,
          })
        }),
        updateProfileById: builder.mutation({
          query: ({projectId, profileId, patchData}) => ({
            url: BackendRoutes.UPDATE_PROFILE(projectId, profileId),
            method: 'PATCH',
            body: patchData,
          }),
        }),
        deleteProfileById: builder.mutation({
            query: ({ projectId, profileId }) => ({
                url: BackendRoutes.DELETE_PROFILE(projectId, profileId),
                method: 'DELETE',
            }),
        }),
        getProjectAssignmentByProfileId: builder.query({
            query: (projectId, profileId) => ({
                url: BackendRoutes.GET_PROJECT_ASSIGNMENT_BY_PROJECT_ID(projectId, profileId),
                credentials: 'include',
            }),
        }),
        updateProjectAssignmentByProfileId: builder.mutation({
          query: (projectId, profileId, patchData) => ({
            url: BackendRoutes.UPDATE_PROJECT_ASSIGNMENT(projectId, profileId),
            method: 'PATCH',
            body: patchData,
          }),
        }),
    }),
});

export const { useGetProfilesByProjectIdQuery, useGetProfileByIdQuery, useCreateProfileForProjectMutation,
  useUpdateProfileByIdMutation, useDeleteProfileByIdMutation, useGetProjectAssignmentByProfileIdQuery, useUpdateProjectAssignmentByProfileIdMutation } = profileApi;