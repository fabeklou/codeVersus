import * as yup from 'yup';

const LoginSchema = yup.object({
  body: yup.object({
    usernameOrEmail:
      yup.string()
        .required('Authentication requires a username/email.')
        .min(3, 'Invalid username/handle or password.')
        .max(21, 'Invalid username/handle or password.'),
    password:
      yup.string()
        .required('Authentication requires a password.')
        .min(8, 'Invalid username/handle or password.')
        .max(80, 'Invalid username/handle or password.')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{8,}$/,
          "Invalid username/handle or password."
        ),
  })
});

export default LoginSchema;
