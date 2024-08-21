import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

class EmailConfirmation {
  static async confirmation(req, res) {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Confirmation token is required.' });
    }

    try {
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid or expired token.' });
      }

      const email = decoded.email;

      await UserModel.updateOne({ email }, { verified: true });

      return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default EmailConfirmation;
