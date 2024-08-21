import { Router } from 'express';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import UpdateProfileSchema from '../validations/updateProfileSchema.js';
import UpdateProfilePictureSchema from '../validations/updateProfilePictureSchema.js';
import UserProfile from '../controllers/UserProfile.js';

const router = Router();

/** User profile routes */

/**
* @swagger
* /api/users/profile:
*   get:
*     summary: User get his profile
*     tags:
*       - Users
*     responses:
*       200:
*         description: Logged in user profile.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 _id:
*                   type: string
*                 username:
*                   type: string
*                 email:
*                   type: string
*                 createdAt:
*                   type: string
*                 updatedAt:
*                   type: string
*                 userProfile:
*                   type: object
*                   properties:
*                     bio:
*                       type: string
*                       example: code versus is so much fun.
*                     interests:
*                       type: array
*                       items:
*                         type: string
*                     profilePicture:
*                       type: string
*                     githubLink:
*                       type: string
*                     xLink:
*                       type: string
*                     linkedinLink:
*                       type: string
*                     friends:
*                       type: array
*                       items:
*                         type: string
*       401:
*         description: Unauthorized.
*       404:
*         description: User not found
*       500:
*         description: Internal server error
*/
router.get('/api/users/profile',
  UserProfile.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: User update his profile
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User update profile data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 description: User biography
 *                 example: code versus is so much fun.
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User interests
 *                 example: ["coding", "reading"]
 *               githubLink:
 *                 type: string
 *                 description: User GitHub profile link
 *                 example: https://github.com/johndoe
 *               xLink:
 *                 type: string
 *                 description: User Twitter (X) profile link
 *                 example: https://twitter.com/johndoe
 *               linkedinLink:
 *                 type: string
 *                 description: User LinkedIn profile link
 *                 example: https://linkedin.com/in/johndoe
 *             required:
 *               - interests
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully.
 *                 userProfile:
 *                   type: object
 *                   properties:
 *                     bio:
 *                       type: string
 *                       example: My bio has now been updated.
 *                     interests:
 *                       type: array
 *                       items:
 *                         type: string
 *                     profilePicture:
 *                       type: string
 *                       description: URL to the uploaded profile picture
 *                     githubLink:
 *                       type: string
 *                     xLink:
 *                       type: string
 *                     linkedinLink:
 *                       type: string
 *       400:
 *         description: Invalid payload.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/api/users/profile',
  requestDataValidation(UpdateProfileSchema),
  UserProfile.updateProfile);

/**
 * @swagger
 * /api/users/profile/picture:
 *   put:
 *     summary: User update his profile picture
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User profile picture
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: User profile picture file
 *             required:
 *               - profilePicture
 *     responses:
 *       200:
 *         description: Profile picture updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profilePicture:
 *                   type: string
 *                   example: https://storage.cloud.google.com/data-codeversus/default_profile.jpeg
 *                 message:
 *                   type: string
 *                   example: Profile picture updated successfully.
 *       400:
 *         description: Invalid payload.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/api/users/profile/picture',
  UserProfile.uploadMulter,
  requestDataValidation(UpdateProfilePictureSchema),
  UserProfile.updateProfilePicture);

/**
 * @swagger
 * /api/users/profile/picture:
 *   delete:
 *     summary: User delete his profile picture
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profilePicture:
 *                   type: string
 *                   example: https://storage.cloud.google.com/data-codeversus/default_profile.jpeg
 *                 message:
 *                   type: string
 *                   example: Profile picture deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/api/users/profile/picture',
  UserProfile.deleteProfilePicture);

/**
 * @swagger
 * /api/users/friends:
 *   get:
 *     summary: User search/find his friends
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *           example: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of friends per page
 *           example: 10
 *           default: 10
 *       - in: query
 *         name: interests
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           description: Filter friends by interests
 *           example: ["coding", "reading"]
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           description: Search query to find friends
 *           example: john
 *     responses:
 *       200:
 *         description: A list of the user's friends.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 8
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1234
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       interests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["coding", "reading"]
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/api/users/friends',
  UserProfile.getFriends);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: User search/find other users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *           example: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of users per page
 *           example: 10
 *           default: 10
 *       - in: query
 *         name: interests
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           description: Filter users by interests
 *           example: ["coding", "reading"]
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           description: Search query to find users
 *           example: john
 *     responses:
 *       200:
 *         description: A list of users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 8
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1234
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       interests:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["coding", "reading"]
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/api/users',
  UserProfile.getUsers);

/**
* @swagger
* /api/users/profile/{username}:
*   get:
*     summary: User get another user profile
*     tags:
*       - Users
*     parameters:
*       - in: path
*         name: username
*         schema:
*           type: string
*           description: Username of the user to get profile
*           example: johndoe
*         required: true
*     responses:
*       200:
*         description: Another user profile.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 username:
*                   type: string
*                 createdAt:
*                   type: string
*                 updatedAt:
*                   type: string
*                 userProfile:
*                   type: object
*                   properties:
*                     bio:
*                       type: string
*                       example: code versus is so much fun.
*                     interests:
*                       type: array
*                       items:
*                         type: string
*                     profilePicture:
*                       type: string
*                     githubLink:
*                       type: string
*                     xLink:
*                       type: string
*                     linkedinLink:
*                       type: string
*                     friends:
*                       type: array
*                       items:
*                         type: string
*       400:
*         description: Bad request.
*       401:
*         description: Unauthorized.
*       404:
*         description: User not found
*       500:
*         description: Internal server error
*/
router.get('/api/users/profile/:username',
  UserProfile.getUserProfile);

/**
* @swagger
* /api/users/friends/{username}:
*   patch:
*     summary: User follow or unfollow another user (friend)
*     tags:
*       - Users
*     parameters:
*       - in: path
*         name: username
*         schema:
*           type: string
*           description: Username of the user to follow or unfollow
*           example: johndoe
*         required: true
*     responses:
*       200:
*         description: Friend removed successfully or added successfully.
*         content:
*           application/json:
*             schema:
*               type: string
*               properties:
*                 message:
*                   type: string
*                   example: Friend removed successfully.
*       400:
*         description: Bad request.
*       401:
*         description: Unauthorized.
*       404:
*         description: User not found
*       500:
*         description: Internal server error
*/
router.patch('/api/users/friends/:username',
  UserProfile.followUnfollowUser);

/**
* @swagger
* /api/users/account:
*   delete:
*     summary: User delete his account and snippets
*     tags:
*       - Users
*     responses:
*       200:
*         description: User account deleted successfully.
*         content:
*           application/json:
*             schema:
*               type: string
*               properties:
*                 message:
*                   type: string
*                   example: User account and snippets deleted successfully.
*       401:
*         description: Unauthorized.
*       404:
*         description: User not found
*       500:
*         description: Internal server error
*/
router.delete('/api/users/account',
  UserProfile.deleteUserAccount);

export default router;
