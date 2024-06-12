const server = "http://localhost:3001";

const BackendRoutes = {
    BASE: server,

    //authentication_api
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",

    //user_api
    GET_ALL_EMPLOYEES: "/employees",
    GET_EMPLOYEE_BY_ID: (employeeId) => "/employees/" + employeeId,
    UPDATE_EMPLOYEE: (employeeId) => "/employees/" + employeeId,
    CREATE_NEW_EMPLOYEE: "/employees",

    //project_api
    GET_ALL_PROJECTS: "/projects",
    GET_PROJECT_BY_ID: (projectId) => "/projects/" + projectId,
    CREATE_NEW_PROJECT: "/projects",
    UPDATE_PROJECT: (projectId) => "/projects/" + projectId,
    GET_PROJECT_ASSIGNMENT_BY_PROJECT_ID: (projectId) => "/projects/" + projectId +  "assign",
    UPDATE_PROJECT_ASSIGNMENT: (projectId) => "/projects/" + projectId +  "assign",

    //profile_api
    GET_ALL_PROFILES_BY_PROJECT_ID: (projectId) => "/projects/" + projectId + "/profiles",
    GET_PROFILE_BY_ID: (projectId, profileId) => "/projects/" + projectId + "/" + profileId,
    CREATE_NEW_PROFILE: (projectId) => "/projects/" + projectId,
    UPDATE_PROFILE: (projectId, profileId) => "/projects/" + projectId + "/" + profileId,
    DELETE_PROFILE: (projectId, profileId) => "/projects/" + projectId + "/" + profileId,

};

export default BackendRoutes;
