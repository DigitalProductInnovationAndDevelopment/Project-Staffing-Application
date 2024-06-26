






export const verifyToken = async (req, res, next) => {
    try {
        let access_token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            access_token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.access_token) {
            access_token = req.cookies.access_token;
        }

        if (!access_token) {
            return next(new AppError('You are not logged in', 401));
        }

        const decoded = verifyJwt(access_token, 'accessTokenPublicKey');

        if (!decoded) {
            return next(new AppError(`Invalid token or user doesn't exist`, 401));
        }

        //Retrieve the session of a user
        const session = await sessionCache.get(decoded.userId);
        if (!session) {
            return next(new AppError(`User session has expired`, 401));
        }

        const user = await getUserService(decoded.userId);

        if (!user) {
            return next(new AppError(`User with that token no longer exists`, 401));
        }

        req.userId = user._id
        req.roles = user.roles

        next();
    } catch (err) {
        next(err);
    }
};

export const checkAuthorization = (permittedRoles = []) => {
    // return a middleware
    return async (request, response, next) => {
        const {userId, roles} = request
        const user = await User.findById(userId);

        if (user && roles.some(role=> permittedRoles.indexOf(role) >= 0)) {
            next(); // role is allowed, so continue on the next middleware
        } else {
            next(new AppError("Forbidden", 403)); // user is forbidden
        }
    }
};
