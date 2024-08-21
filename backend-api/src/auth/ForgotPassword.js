import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import hashPassword from '../utils/hashPassword.js';
import { sendResetPasswordEmail } from '../utils/sendEmailToUser.js';

class ForgotPasword {
  static async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404)
          .json({ error: 'No account linked to this email address.' });
      }

      if (!user.verified) {
        return res.status(401)
          .json({ error: 'Please verify your email address first.' });
      }

      const emailToken = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      sendResetPasswordEmail(email, emailToken);

      return res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    const { token } = req.query;
    const { password, repeatedPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'A valid Token is required.' });
    }

    try {
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid or expired token.' });
      }

      const email = decoded.email;
      const user = UserModel.findOne({ email });

      if (!user) return res.status(404).json({ error: 'User not found.' });

      const hashedPassword = await hashPassword(password);
      await UserModel.updateOne({ email }, { password: hashedPassword });

      return res.status(200).json({ message: 'Password successfully reset.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default ForgotPasword;
