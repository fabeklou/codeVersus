import * as yup from 'yup';

const RegistrationSchema = yup.object({
  body: yup.object({
    username:
      yup.string()
        .required('Username is required.')
        .min(3, 'Username is too short - should be 3 chars minimum.')
        .max(21, 'Username is too long - should be 21 chars maximum.'),
    email:
      yup.string()
        .required('Email is required.')
        .email('Invalid email address.'),
    password:
      yup.string()
        .required('Password is required.')
        .min(8, 'Password is too weak - should be 8 chars minimum.')
        .max(80, 'Password is too long - should be 80 chars maximum.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{8,}$/,
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
        ),
    repeatedPassword:
      yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match.')
        .required('Password, must be confirm.')
  })
});

export default RegistrationSchema;
