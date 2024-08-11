import { Router } from 'express';
import UserLogin from './UserLogin.js';
import UserSignup from './UserSignup.js';
import RegistrationSchema from '../validations/RegistrationSchema.js'
import requestDataValidation from '../middlewares/requestDataValidation.js'

const router = Router();

router.post('/api/register',
  requestDataValidation(RegistrationSchema),
  UserSignup.register);

router.post('/api/login',
  UserLogin.login);

export default router;
