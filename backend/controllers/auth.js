
import User from '../models/User.js'


export const loginController = async (req, res) => {
  try {

    console.log('loginController');

    // extract credentials from request body
    const email = req.body.email;
    const password = req.body.password;
    // const { email, password } = req.body;

    console.log('email:', email);
    console.log('password:', password);

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
