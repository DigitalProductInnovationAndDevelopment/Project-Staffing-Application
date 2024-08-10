import User from '../models/User.js'

export const loginService = async (loginData) => {
  try {
    // extract credentials from request body
    const { email, password } = loginData

    // check if user exists via email
    const user = await User.findOne({ email: email })
    if (!user) throw new Error('User does not exist.')

    // check if password is correct
    if (password !== user.password) throw new Error('Invalid credentials.')

    // TODO LATER: advanced password hashing
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // send response
    delete user.password // remove password before sending back response
    return user
  } catch (err) {
    throw new Error('Failed to log in user:' + err.message)
  }
}
