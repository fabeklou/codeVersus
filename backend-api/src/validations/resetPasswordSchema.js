import * as yup from 'yup';

const ResetPasswordSchema = yup.object({
  query: yup.object({
    token:
      yup.string()
        .required('Token is required.')
  }),
  body: yup.object({
    password:
      yup.string()
        .required('Password is required.')
        .min(8, 'Password is too weak - should be 8 chars minimum.')
        .max(80, 'Password is too long - should be 80 chars maximum.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).*$/,
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
        ),
    repeatedPassword:
      yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match.')
        .required('Password, must be confirm.')
  })
});

export default ResetPasswordSchema;
