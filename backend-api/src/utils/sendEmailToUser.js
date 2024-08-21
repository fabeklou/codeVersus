import nodemailer from 'nodemailer';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendConfirmationEmail = async (userEmail, emailToken) => {
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

const sendResetPasswordEmail = async (userEmail, emailToken) => {
  const appUrl = process.env.BACKEND_API_URL;
  const url = `${appUrl}/api/auth/password/reset?token=${emailToken}`;

  const mailOptions = {
    from: {
      name: '⚔️ CodeVersus',
      address: process.env.EMAIL_ADDRESS
    },
    to: userEmail,
    subject: 'Reset your password',
    html: `Please click on this link to reset your password: <a href="${url}">${url}</a>`
  };

  return emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error(error);
    } else {
      return `Email sent: ${info.response}`;
    }
  });
}

export { sendConfirmationEmail, sendResetPasswordEmail };
