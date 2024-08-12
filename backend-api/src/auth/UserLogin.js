import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';

class UserLogin {
  static async login(req, res) {
    const { usernameOrEmail, password } = req.body;

    try {
      let user;

      user = await UserModel.findOne({ email: usernameOrEmail });
      if (!user) {
        user = await UserModel.findOne({ username: usernameOrEmail });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid username/email or password.' });
      }

      if (user.verified === false) {
        return res.status(401).json({ error: 'Please verify your account.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username/email or password.' });
      }
      req.session.visited = true;
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.email = user.email;
      req.session.loggedIn = true;

      return res.status(200).json({ message: 'success' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default UserLogin;
