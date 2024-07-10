import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  try {
    // access jwt_token from cookies
    const token = req.cookies.jwt_token

    // if no token, return 403 Forbidden
    if (!token) {
      return res.status(403).send('Access Denied')
    }

    // remove 'Bearer ' from token string if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()
    }

    // verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET)

    // make verified data accessible for any subsequent middleware function or route handler
    req.user = verified

    next()
  } catch (err) {
    res.clearCookie('jwt_token')
    return next(new AppError('You are not logged in', 401))
  }
}
