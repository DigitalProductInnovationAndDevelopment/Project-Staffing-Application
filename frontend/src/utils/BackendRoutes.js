const server = "http://localhost:3001";

const BackendRoutes = {
    BASE: server,

    //authentication_api
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",

    //user_api
    CREATE_NEW_USER: "/user",
    GET_ALL_USERS: "/user",
    GET_USER_BY_ID: (userId) => "/user/" + userId,
    UPDATE_USER: (userId) => "/user/" + userId,
    DELETE_USER: (userId) => "/user/" + userId,

    //project_api
    CREATE_NEW_PROJECT: "/project",
    GET_ALL_PROJECTS: "/project",
    GET_PROJECT_BY_ID: (projectId) => "/project/" + projectId,
    GET_PROJECT_ASSIGNMENT_BY_PROJECT_ID: (projectId, profileId) => "/project/" + projectId + "/" + profileId + "assign",
    UPDATE_PROJECT: (projectId) => "/project/" + projectId,
    UPDATE_PROJECT_ASSIGNMENT: (projectId, profileId) => "/project/" + projectId + "/" + profileId + "assign",
    DELETE_PROJECT: (projectId) => "/project/" + projectId,
    //project_api >> profile_api
    CREATE_NEW_PROFILE: (projectId) => "/project/" + projectId,
    GET_ALL_PROFILES_BY_PROJECT_ID: (projectId) => "/project/" + projectId + "/profiles",
    GET_PROFILE_BY_ID: (projectId, profileId) => "/project/" + projectId + "/" + profileId,
    UPDATE_PROFILE: (projectId, profileId) => "/project/" + projectId + "/" + profileId,
    DELETE_PROFILE: (projectId, profileId) => "/project/" + projectId + "/" + profileId,
};

export default BackendRoutes;
