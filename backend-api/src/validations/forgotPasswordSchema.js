import * as yup from 'yup';

const ForgotPasswordSchema = yup.object({
  body: yup.object({
    email:
      yup.string()
        .required('Email is required.')
        .email('Invalid email address.'),
  })
});

export default ForgotPasswordSchema;
