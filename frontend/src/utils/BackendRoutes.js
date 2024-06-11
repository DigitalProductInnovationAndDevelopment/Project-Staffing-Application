const server = "http://localhost:3001";

const BackendRoutes = {
    BASE: server,

    //authentication_api
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",

    //user_api
    GET_ALL_EMPLOYEES: "/employees",
    GET_EMPLOYEE_BY_ID: "/employees/:id",
    UPDATE_EMPLOYEE: "/employees/:id",
    CREATE_NEW_EMPLOYEE: "/employees",

    //project_api
    GET_ALL_PROJECTS: "/projects",
    GET_PROJECT_BY_ID: "/projects/:id",
    CREATE_NEW_PROJECT: "/projects",
    UPDATE_PROJECT: "/projects/:id",
    GET_PROJECT_ASSIGNMENT_BY_PROJECT_ID: "/projects/:id/assign",
    UPDATE_PROJECT_ASSIGNMENT: "/projects/:id/assign",

    //profile_api
    GET_ALL_PROFILES_BY_PROJECT_ID: "/projects/:id/profiles",
    GET_PROFILE_BY_ID: "/projects/:id/:profileId",
    CREATE_NEW_PROFILE: "/projects/:id",
    UPDATE_PROFILE: "/projects/:id/:profileId",
    DELETE_PROFILE: "/projects/:id/:profileId",

};

export default BackendRoutes;
