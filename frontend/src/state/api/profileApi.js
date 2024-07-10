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
    }),
});

export const { useGetProfilesByProjectIdQuery } = profileApi;