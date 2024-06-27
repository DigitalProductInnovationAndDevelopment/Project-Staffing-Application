import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import Routes from "../utils/FrontendRoutes";
import SnackbarOptions from "../utils/SnackbarOptions";
import {useDispatch, useSelector} from "react-redux";

const AuthenticationMiddleware = ({ children }) => {
    const loggedIn = useSelector((state) => state.authSlice.loggedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // trigger the action when yourState changes
        if(!loggedIn) {
            enqueueSnackbar("Login required.", SnackbarOptions.INFO);
            navigate(Routes.LOGIN)
        }
    }, [loggedIn, dispatch]);

    return children;
};

export default AuthenticationMiddleware;