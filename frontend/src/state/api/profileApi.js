import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";

export const profileApi = createApi({
    reducerPath: "profileApi",
    tagTypes: ['Profiles'],
    baseQuery: fetchBaseQuery({ baseUrl: BackendRoutes.BASE }),
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