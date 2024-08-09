import {createApi} from "@reduxjs/toolkit/query/react";
import BackendRoutes from "../../utils/BackendRoutes";
import customFetchBase from "./baseQuery";

export const skillApi = createApi({
    reducerPath: "skillApi",
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getSkills: builder.query({
            query: () => ({
                url: BackendRoutes.GET_SKILLS,
                credentials: 'include',
            }),
        }),
        updateSkill: builder.mutation({
          query: ( skillId, patchData ) => ({
            url: BackendRoutes.UPDATE_SKILL(skillId),
            method: 'PATCH',
            body: patchData,
          }),
        }),
        createSkill: builder.mutation({
          query: (payload) => ({
            url: BackendRoutes.CREATE_SKILLS,
            method: 'POST',
            body: payload,
          }),
        }),
        deleteSkill: builder.mutation({
            query: (skillId) => ({
                url: BackendRoutes.DELETE_SKILL(skillId),
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetSkillsQuery, useUpdateSkillMutation, useCreateSkillMutation, useDeleteSkillMutation} = skillApi;
