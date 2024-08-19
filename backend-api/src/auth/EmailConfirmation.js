import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

class EmailConfirmation {
  static async sendConfirmationEmail(userEmail, emailToken) {
    const appUrl = process.env.BACKEND_API_URL;
    const url = `${appUrl}/api/auth/confirmation?token=${emailToken}`;

    const mailOptions = {
      from: {
        name: '⚔️ CodeVersus',
        address: process.env.EMAIL_ADDRESS
      },
      to: userEmail,
      subject: 'Verify your email',
      html: `Please click on this link to verify your email: <a href="${url}">${url}</a>`
    };

    return emailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new Error(error);
      } else {
        /** return res.status(200).json({ message: `Email sent: ${info.response}` }); */
        return `Email sent: ${info.response}`;
      }
    });
  }

  static async confirmation(req, res) {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Confirmation token is required.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;

      await UserModel.updateOne({ email }, { verified: true });

      return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }
}

export default EmailConfirmation;
