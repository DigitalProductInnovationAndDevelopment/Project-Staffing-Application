import {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import Routes from "../utils/FrontendRoutes";
import SnackbarOptions from "../utils/SnackbarOptions";
import {useDispatch, useSelector} from "react-redux";
import {setLoginRequired} from "../state/authSlice";


const AuthenticationMiddleware = ({ children }) => {
    const loggedIn = useSelector((state) => state.authSlice.loggedIn);
    const loginRequired = useSelector((state) => state.authSlice.loginRequired);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // trigger the action when state changes
    useEffect(() => {
        if (loginRequired) {
            enqueueSnackbar("Refreshing access token failed. Login required.", SnackbarOptions.INFO);
            navigate(Routes.LOGIN);
            dispatch(setLoginRequired({ loginRequired: false, loggedIn: false }));
        } else if (!loggedIn) {
            enqueueSnackbar("Login required.", SnackbarOptions.INFO);
            navigate(Routes.LOGIN);
        }
    }, [loginRequired, loggedIn, dispatch]);

    return children;
};

export default AuthenticationMiddleware;