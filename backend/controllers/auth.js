
import User from '../models/User.js'
import jwt from 'jsonwebtoken';
import config from 'config'


const accessTokenCookieOptions = {
  expires: new Date(
      Date.now() + config.get('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

export const loginController = async (req, res) => {
  try {
    // extract credentials from request body
    const { email, password } = req.body; 

    // check if user exists via email
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // check if password is correct
    if (password !== user.password) return res.status(400).json({ msg: "Invalid credentials. "});

    // TODO LATER: advanced password hashing
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // set response cookie
    res.cookie("jwt_token", token, {
      httpOnly: true,
    });

    // send response
    delete user.password; // remove password before sending back response
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const logoutController = async (req, res, next) => {
  try {
    // TODO
    res.send('logoutController')
  } catch (err) {
    next(err)
  }
}
