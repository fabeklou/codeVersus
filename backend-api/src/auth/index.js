import { Router } from 'express';
import UserLogin from './UserLogin.js';
import UserSignup from './UserSignup.js';
import RegistrationSchema from '../validations/RegistrationSchema.js';
import LoginSchema from '../validations/LoginSchema.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import UserLogout from './UserLogout.js';
import EmailConfirmation from './EmailConfirmation.js';
import checkAuthStatus from '../middlewares/checkAuthStatus.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 example: MySecurePassword-123
 *               repeatedPassword:
 *                 type: string
 *                 format: password
 *                 description: The user's password confirmation
 *                 example: MySecurePassword-123

 *             required:
 *               - username
 *               - email
 *               - password
 *               - repeatedPassword
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your account was successfuly created, please verify your email.
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post('/api/auth/register',
  requestDataValidation(RegistrationSchema),
  UserSignup.register);

router.post('/api/auth/login',
  requestDataValidation(LoginSchema),
  UserLogin.login);

router.get('/api/auth/status',
  checkAuthStatus,
  (req, res) => res.status(200).json({ message: 'connected' }));

router.get('/api/auth/logout',
  UserLogout.logout);

router.get('/api/auth/confirmation',
  EmailConfirmation.confirmation);

export default router;
