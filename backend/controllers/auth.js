import config from 'config';
import { loginService, signToken, verifyEmailService } from "../services/auth.js";
import { getUserByEmailService, getUserByIdService } from "../services/user.js";
import {signJwt, verifyJwt} from "../utils/jwt.js";




const accessTokenCookieOptions = {
    expires: new Date(
        Date.now() + config.get('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get('accessTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};
const refreshTokenCookieOptions = {
    expires: new Date(
        Date.now() + config.get('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get('refreshTokenExpiresIn') * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

export const loginController = async (req, res, next) => {
    try {
        const user = await getUserByEmailService(req.body.email);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        //Check user state
        /*
        if (user.state !== UserState.VERIFIED) {
            return next(new AppError('User is not verified.', 403))
        }
        */

        //Checks if password does match
        const isMatch = await loginService(req.body.email, req.body.password);
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401));
        }

        //Sign token
        const {access_token, refresh_token} = await signToken(user);

        //Set cookies for authentication
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);

        //Just return the cookies, nothing else needed
        res.status(204).json();
    } catch (err) {
        next(err);
    }
};

export const logoutController = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.userId);
        //Delete the userId from the session store
        sessionCache.del(user._id.toString())
        logout(res);
        return res.status(204).json();
    } catch (err) {
        next(err);
    }
};

const logout = (res) => {
    //Logout function resets authentication tokens
    res.cookie('access_token', '', {maxAge: 1});
    res.cookie('refresh_token', '', {maxAge: 1});
};

export const verifyEmailController = async (req, res, next) => {
    try {
        const {token} = req.params;
        if (!token) {
            return next(new AppError("Verification failed, no token present.", 400));
        }

        const {verified} = await verifyEmailService(token);

        if (verified === undefined) {
            return next(new AppError("Verification failed, invalid token.", 400));
        }

        //Check if already verified
        if (verified === false) {
            return res.status(200).json({msg: "Verification already performed. You can log into the platform."})
        }

        return res.status(200).json({msg: "Verification successful. You can now log into the platform."})
    } catch (err) {
        next(err);
    }
}

export const refreshAccessTokenController = async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;

        const decoded = verifyJwt(refresh_token, 'refreshTokenPublicKey');
        const message = 'Could not refresh access token';
        if (!decoded) {
            return next(new AppError(message, 403));
        }

        //Retrieve session from the store
        const session = await sessionCache.get(decoded.userId);
        if (!session) {
            return next(new AppError(message, 403));
        }

        const user = await getUserByIdService(decoded.userId);
        if (!user) {
            return next(new AppError(message, 403));
        }

        //Sign new access token
        const access_token = signJwt({userId: user._id}, 'accessTokenPrivateKey', {
            expiresIn: `${config.get('accessTokenExpiresIn')}m`,
        });

        //Return new access token
        res.cookie('access_token', access_token, accessTokenCookieOptions);

        res.status(204).json();
    } catch (err) {
        next(err);
    }
};
