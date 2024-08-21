import jwt from 'jsonwebtoken';
import hashPassword from '../utils/hashPassword.js';
import UserModel from '../models/User.js';
import { sendConfirmationEmail } from '../utils/sendEmailToUser.js';

class UserSignup {
  static async register(req, res) {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);

      /** Default profile picture */
      const profilePicture = process.env.GCP_DEFAULT_IMAGE_URL;

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        userProfile: {
          profilePicture,
        }
      });
      await newUser.save();

      /** Email confirmation logic */
      try {
        const emailToken = jwt.sign(
          { email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        sendConfirmationEmail(email, emailToken);
      } catch (error) {
        return res.status(400).json({ error });
      }

      return res.status(200).json({
        message: 'Your account was successfuly created, please verify your email.'
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserSignup;
