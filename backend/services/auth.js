




export const loginService = async (email, password) => {
    const user = await getUserByEmailService(email);
    if (!user) return {user: undefined, token: undefined}

    return await bcrypt.compare(password, user.password);
}

export const signToken = async (user) => {
    const access_token = signJwt({userId: user._id}, 'accessTokenPrivateKey', {
        expiresIn: `${config.get('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({userId: user._id}, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get('refreshTokenExpiresIn')}m`,
    });

    //Insert the userId into the session store for refreshing
    sessionCache.set(user._id.toString(), true);

    return {access_token, refresh_token};
};

export const verifyEmailService = async (token) => {
    try {
        // Verifying the JWT token
        const {id} = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);

        if (!user) return {verified: undefined}

        if (user.state === UserState.VERIFIED) {
            return {verified: false} //Already verified
        } else {
            user.state = UserState.VERIFIED;
            await updateUserService(user);
            return {verified: true}
        }
    } catch (err) {
        return {verified: undefined}
    }
}