import { Router } from 'express';
import UserLogin from './UserLogin.js';
import UserSignup from './UserSignup.js';
import RegistrationSchema from '../validations/RegistrationSchema.js';
import LoginSchema from '../validations/LoginSchema.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import UserLogout from './UserLogout.js';
import EmailConfirmation from './EmailConfirmation.js';
import checkAuthStatus from '../middlewares/checkAuthStatus.js';
import ForgotPasswordSchema from '../validations/forgotPasswordSchema.js';
import ResetPasswordSchema from '../validations/resetPasswordSchema.js';
import ForgotPasword from './ForgotPassword.js';
import {
  loginLimiterMiddleware,
  passwordResetLimiterMiddleware
} from '../middlewares/rateLimiterRedis.js';

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

/**
* @swagger
* /api/auth/login:
*   post:
*     summary: User login
*     tags:
*       - Authentication
*     requestBody:
*       description: User authentication data
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               usernameOrEmail:
*                 type: string
*                 description: The user's username or email address
*                 example: johndoe
*               password:
*                 type: string
*                 format: password
*                 description: The user's password
*                 example: MySecurePassword-123

*             required:
*               - usernameOrEmail
*               - password
*     responses:
*       200:
*         description: User logged in.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: User logged in successfully.
*       400:
*         description: Invalid username/email or password.
*       401:
*         description: Please verify your account.
*       429:
*         description: Too many failed login attempts. wait 15 minutes and try again.
*       500:
*         description: Internal server error
*/
router.post('/api/auth/login',
  loginLimiterMiddleware,
  requestDataValidation(LoginSchema),
  UserLogin.login);

/**
* @swagger
* /api/auth/status:
*   get:
*     summary: User autentication status
*     tags:
*       - Authentication
*     responses:
*       200:
*         description: User is logged in.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: connected.
*       401:
*         description: Unauthorized.
*/
router.get('/api/auth/status',
  checkAuthStatus,
  (req, res) => res.status(200).json({ message: 'connected' }));

/**
* @swagger
* /api/auth/logout:
*   get:
*     summary: User logout
*     tags:
*       - Authentication
*     responses:
*       200:
*         description: User is logged out.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: User logged out successfully.
*       400:
*         description: You were already logged out.
*       401:
*         description: Unable to logout.
*/
router.get('/api/auth/logout',
  UserLogout.logout);

/**
 * @swagger
 * /api/auth/confirmation:
 *   get:
 *     summary: User email confirmation
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: JWT token sent to user email.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20ifQ.0H3zq8Gm8TQJ5J2jDq0kPbJ9zv9J1GJvK6Y9J1GJvK6
 *     responses:
 *       200:
 *         description: User email verified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully..
 *       400:
 *         description: Confirmation JWT token is required.
 *       401:
 *         description: jwt error message.
 *       500:
 *         description: Internal server error
 */
router.get('/api/auth/confirmation',
  EmailConfirmation.confirmation);

/**
* @swagger
* /api/auth/password/forgot:
*   post:
*     summary: User Forgot his Password
*     tags:
*       - Authentication
*     requestBody:
*       description: User email address
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 description: The user's email address
*                 example: johndoe@example.com
*             required:
*               - email
*     responses:
*       200:
*         description: Password reset email successfully sent.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Password reset email sent.
*       400:
*         description: Bad request / Email is required.
*       401:
*         description: Please verify your email address first.
*       404:
*         description: No account linked to this email address.
*       429:
*         description: Too many requests / You must wait 7 days from your last password reset.
*       500:
*         description: Internal server error
*/
router.post('/api/auth/password/forgot',
  passwordResetLimiterMiddleware,
  requestDataValidation(ForgotPasswordSchema),
  ForgotPasword.forgotPassword);

/**
* @swagger
* /api/auth/password/reset:
*   post:
*     summary: User reset his Password (create new password)
*     tags:
*       - Authentication
*     parameters:
*       - in: query
*         name: token
*         required: true
*         schema:
*           type: string
*           description: JWT token sent to user email.
*           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20ifQ.0H3zq8Gm8TQJ5J2jDq0kPbJ9zv9J1GJvK6Y9J1GJvK6
*     requestBody:
*       description: User new password and repeated password
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               password:
*                 type: string
*                 format: password
*                 description: The user's password
*                 example: MyNewSecurePassword-123
*               repeatedPassword:
*                 type: string
*                 format: password
*                 description: The user's password repeated
*                 example: MyNewSecurePassword-123

*             required:
*               - password
*               - repeatedPassword
*     responses:
*       200:
*         description: Password reset.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Password successfully reset.
*       400:
*         description: Bad request / A valid Token is required.
*       404:
*         description: User not found.
*       500:
*         description: Internal server error
*/
router.post('/api/auth/password/reset',
  requestDataValidation(ResetPasswordSchema),
  ForgotPasword.resetPassword);

export default router;
