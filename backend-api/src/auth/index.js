import { Router } from 'express';
import UserLogin from './UserLogin.js';
import UserSignup from './UserSignup.js';
import RegistrationSchema from '../validations/RegistrationSchema.js';
import LoginSchema from '../validations/LoginSchema.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import UserLogout from './UserLogout.js';
import EmailConfirmation from './EmailConfirmation.js';

const router = Router();

router.post('/api/auth/register',
  requestDataValidation(RegistrationSchema),
  UserSignup.register);

router.post('/api/auth/login',
  requestDataValidation(LoginSchema),
  UserLogin.login);

router.get('/api/auth/logout',
  UserLogout.logout);

router.get('/api/auth/confirmation',
  EmailConfirmation.confirmation);

export default router;
