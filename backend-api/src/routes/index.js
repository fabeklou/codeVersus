import { Router } from 'express';
import SubmitCode from '../controllers/SubmitCode.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import CodeSubmissionSchema from '../validations/codeSubmissionSchema.js';
import snippetSchema from '../validations/snippetSchema.js';
import CodeSnippet from '../controllers/CodeSnippet.js';
import UpdateProfileSchema from '../validations/updateProfileSchema.js';
import UserProfile from '../controllers/UserProfile.js';
import UpdateSnippetSchema from '../validations/UpdateSnippetSchema.js';
import upload from '../utils/multerProfilePicture.js';

const router = Router();

/** Code submission routes */

/**
* @swagger
* /api/submissions:
*   post:
*     summary: User submit code for execution
*     tags:
*       - Code Submission
*     requestBody:
*       description: Code submission data
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               submission:
*                 type: string
*                 description: Code submited by the user
*                 example: "print('Hello from Code Versus: ', input(), input(), input())"
*               language:
*                 type: string
*                 description: Pragramming language of user's code submission
*                 example: Python
*               stdin:
*                 type: string
*                 description: Standard input for the code submission
*                 example: "1\n3\n4"
*
*             required:
*               - submission
*               - language
*     responses:
*       200:
*         description: Successful code execution.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 stdout:
*                   type: string
*                   example: SGVsbG8gZnJvbSBKdWRnZTA6ICAxIDMgNAo=
*                 stderr:
*                   type: string/null
*                   example: null
*                 token:
*                   type: string
*                   example: 1e7b1b7b-7b1e-4b7b-8b1e-1e7b1b7b1e7b
*                 compile_output:
*                   type: string/null
*                   example: null
*                 status:
*                   type: object
*                   properties:
*                     description:
*                       type: string
*                       example: Accepted
*                     id:
*                       type: number
*                       example: 3
*                 message:
*                   type: string/null
*                   example: success.
*       400:
*         description: Invalid or unsupported language.
*       401:
*         description: Unauthorized.
*       500:
*         description: Internal server error
*/
router.post('/api/submissions',
  requestDataValidation(CodeSubmissionSchema),
  SubmitCode.submissions);

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
 *     summary: Update user profile
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User update profile data
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file
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
  upload.single('profilePicture'),
  UserProfile.updateProfile);

/**
 * @swagger
 * /api/users/friends:
 *   get:
 *     summary: User retrieve his friends
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
 *     summary: User retrieve other users
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

/** Snippet routes */

/**
* @swagger
* /api/snippets:
*   post:
*     summary: User create new code snippet
*     tags:
*       - Code Snippet
*     requestBody:
*       description: Code snippet data
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: Title of the code snippet
*                 example: My first code snippet
*                 default: Untitled Snippet
*               language:
*                 type: string
*                 description: Pragramming language of the code snippet
*                 example: Python
*               codeSnippet:
*                 type: string
*                 description: Code snippet, base64 encoded
*                 example: ZGVmIG1haW4oKToKICAgIHByaW50KCdIZWxsbyBmcm9tIGNvZGUgdmVyc3VzIikK
*               description:
*                 type: string
*                 description: Description of the code snippet
*                 example: This code snippet converts a string to uppercase
*               tags:
*                 type: array
*                 items:
*                   type: string
*                 description: Tags for the code snippet
*                 example: ["python", "string"]
*               isPublic:
*                 type: boolean
*                 description: Code snippet visibility
*                 example: true
*             required:
*               - title
*               - language
*               - codeSnippet
*               - description
*               - tags
*               - isPublic
*
*     responses:
*       200:
*         description: Snippet saved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Snippet saved successfully
*                 data:
*                   type: object
*                   properties:
*                     _id:
*                       type: string
*                     title:
*                       type: string
*       400:
*         description: Invalid payload.
*       401:
*         description: Unauthorized.
*       500:
*         description: Internal server error
*/
router.post('/api/snippets',
  requestDataValidation(snippetSchema),
  CodeSnippet.saveCodeSnippet);

/**
 * @swagger
 * /api/snippets:
 *   get:
 *     summary: User search/find code snippets
 *     tags:
 *       - Code Snippet
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
 *           description: Number of snippets per page
 *           example: 10
 *           default: 10
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           description: Filter snippets by tags
 *           example: ["string", "priority queue"]
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           description: Search query to find snippets
 *           example: backtracking
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           description: Filter snippets by programming language
 *           example: Javascript
 *     responses:
 *       200:
 *         description: A list of snippets found.
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
 *                 snippets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 60b9e6d9c7c9d00015b4c5b2
 *                       title:
 *                         type: string
 *                         example: My first code snippet
 *                       language:
 *                         type: string
 *                         example: Python
 *                       codeSnippet:
 *                         type: string
 *                         example: ZGVmIG1haW4oKToKICAgIHByaW50KCdIZWxsbyBmcm9tIGNvZGUgdmVyc3VzIikK
 *                       description:
 *                         type: string
 *                         example: This code snippet converts a string to uppercase
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["python", "string"]
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized..
 *       500:
 *         description: Internal server error.
 */
router.get('/api/snippets',
  CodeSnippet.getCodeSnippets);

/**
* @swagger
* /api/snippets/{snippetId}:
*   get:
*     summary: User get a code snippet by id
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to fetch
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*     responses:
*       200:
*         description: Code snippet fetched successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: string
*                   example: 60b9e6d9c7c9d00015b4c5b2
*                 title:
*                   type: string
*                   example: My first code snippet
*                 language:
*                   type: string
*                   example: Python
*                 codeSnippet:
*                   type: string
*                   example: ZGVmIG1haW4oKToKICAgIHByaW50KCdIZWxsbyBmcm9tIGNvZGUgdmVyc3VzIikK
*                 description:
*                   type: string
*                   example: This code snippet converts a string to uppercase
*                 tags:
*                   type: array
*                   items:
*                     type: string
*                   example: ["dp", "string"]
*                 isPublic:
*                   type: boolean
*                   example: true
*                 username:
*                   type: string
*                   example: johndoe
*                 privateLink:
*                   type: string
*                   example: 25A8FC2A-98F2-4B86-98F6-84324AF28611
*       400:
*         description: Bad request.
*       401:
*         description: Unauthorized.
*       403:
*         description: Unauthorized access.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.get('/api/snippets/:snippetId',
  CodeSnippet.getCodeSnippetById);

/**
* @swagger
* /api/snippets/{snippetId}:
*   put:
*     summary: User update code snippet by ID
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to update
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*     requestBody:
*       description: Code snippet data
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: Title of the code snippet
*                 example: My first code snippet
*                 default: Untitled Snippet
*               language:
*                 type: string
*                 description: Pragramming language of the code snippet
*                 example: Python
*               codeSnippet:
*                 type: string
*                 description: Code snippet, base64 encoded
*                 example: ZGVmIG1haW4oKToKICAgIHByaW50KCdIZWxsbyBmcm9tIGNvZGUgdmVyc3VzIikK
*               description:
*                 type: string
*                 description: Description of the code snippet
*                 example: This code snippet converts a string to uppercase
*               tags:
*                 type: array
*                 items:
*                   type: string
*                 description: Tags for the code snippet
*                 example: ["python", "string"]
*               isPublic:
*                 type: boolean
*                 description: Code snippet visibility
*                 example: true
*             required:
*
*     responses:
*       200:
*         description: Snippet updated.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Snippet updated successfully.
*       400:
*         description: Invalid payload.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.put('/api/snippets/:snippetId',
  requestDataValidation(UpdateSnippetSchema),
  CodeSnippet.updateCodeSnippetById);

/**
* @swagger
* /api/snippets/{snippetId}:
*   delete:
*     summary: User delete code snippet by ID
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to delete
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*
*     responses:
*       200:
*         description: Snippet deleted.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Snippet deleted successfully.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.delete('/api/snippets/:snippetId',
  CodeSnippet.deleteCodeSnippetById);

/**
* @swagger
* /api/snippets/link/generate/{snippetId}:
*   patch:
*     summary: User generate private link for code snippet by ID
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to generate private link for
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*     responses:
*       200:
*         description: Code snippet private link generated.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 privateLink:
*                   type: string
*                   example: endpointUrl/25A8FC2A-98F2-4B86-98F6-84324AF28611
*       400:
*         description: Private link already exists for this snippet.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.patch('/api/snippets/link/generate/:snippetId',
  CodeSnippet.generateCodeSnippetLink);

/**
* @swagger
* /api/snippets/link/remove/{snippetId}:
*   patch:
*     summary: User remove private link for code snippet by ID
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to remove private link for
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*     responses:
*       200:
*         description: Code snippet private link removed.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Private link removed successfully.
*       400:
*         description: No private link found for this snippet.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.patch('/api/snippets/link/remove/:snippetId',
  CodeSnippet.removeCodeSnippetLink);

/**
* @swagger
* /api/snippets/link/{snippetId}:
*   get:
*     summary: User get private code snippet link by id
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to fetch private link
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*     responses:
*       200:
*         description: User code snippet private link fetched successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 privateLink:
*                   type: string
*                   example: endpointUrl/25A8FC2A-98F2-4B86-98F6-84324AF28611
*       400:
*         description: Bad request.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found or No private link found for this snippet.
*       500:
*         description: Internal server error
*/
router.get('/api/snippets/link/:snippetId',
  CodeSnippet.getCodeSnippetLink);

/**
* @swagger
* /api/snippets/from/{privateLink}:
*   get:
*     summary: User get a shared code snippet by private link
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: privateLink
*         schema:
*           type: string
*           description: privateLink of the code snippet to fetch
*           example: 25A8FC2A-98F2-4B86-98F6-84324AF28611
*         required: true
*     responses:
*       200:
*         description: Code snippet fetched successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 title:
*                   type: string
*                   example: My first code snippet
*                 language:
*                   type: string
*                   example: Python
*                 codeSnippet:
*                   type: string
*                   example: ZGVmIG1haW4oKToKICAgIHByaW50KCdIZWxsbyBmcm9tIGNvZGUgdmVyc3VzIikK
*                 description:
*                   type: string
*                   example: This code snippet converts a string to uppercase
*                 tags:
*                   type: array
*                   items:
*                     type: string
*                   example: ["dp", "string"]
*                 username:
*                   type: string
*                   example: johndoe
*                 privateLink:
*                   type: string
*                   example: 25A8FC2A-98F2-4B86-98F6-84324AF28611
*       400:
*         description: Bad request.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.get('/api/snippets/from/:privateLink',
  CodeSnippet.getCodeSnippetFromLink);

/**
 * @swagger
 * /api/snippets/public:
 *   get:
 *     summary: User search/find public code snippets
 *     tags:
 *       - Code Snippet
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
 *           description: Number of snippet per page
 *           example: 10
 *           default: 10
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           description: Filter snippets by tags
 *           example: ["string", "dq", "heap"]
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           description: Search query to find snippets
 *           example: backtracking
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           description: Filter snippets by programming language
 *           example: Javascript
 *     responses:
 *       200:
 *         description: A list of public snippets found.
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
 *                   example: 10
 *                 snippets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60b9e6d9c7c9d00015b4c5b2
 *                       title:
 *                         type: string
 *                         example: My first code snippet
 *                       language:
 *                         type: string
 *                         example: Python
 *                       codeSnippet:
 *                         type: string
 *                         example: ZGVmIG1haW4oKToKICAgIHByaW50KCdIZWxsbyBmcm9tIGNvZGUgdmVyc3VzIikK
 *                       description:
 *                         type: string
 *                         example: This code snippet converts a string to uppercase
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["python", "string"]
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       isPublic:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         example: 2021-06-03T12:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         example: 2021-06-03T12:00:00.000Z
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["daniel", "jane"]
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.get('/api/snippets/public',
  CodeSnippet.getPublicCodeSnippets);

/**
* @swagger
* /api/snippets/like/{snippetId}:
*   patch:
*     summary: User like or unlike a code snippet by ID
*     tags:
*       - Code Snippet
*     parameters:
*       - in: path
*         name: snippetId
*         schema:
*           type: string
*           description: ObjectID of the code snippet to like or unlike
*           example: 60b9e6d9c7c9d00015b4c5b2
*         required: true
*     responses:
*       200:
*         description: Code snippet liked or unliked successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Code snippet liked successfully.
*       400:
*         description: Bad request.
*       401:
*         description: Unauthorized.
*       404:
*         description: Snippet not found.
*       500:
*         description: Internal server error
*/
router.patch('/api/snippets/like/:snippetId',
  CodeSnippet.likeUnlikeCodeSnippet);

export default router;
