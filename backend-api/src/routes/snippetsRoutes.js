import { Router } from 'express';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import snippetSchema from '../validations/snippetSchema.js';
import CodeSnippet from '../controllers/CodeSnippet.js';
import UpdateSnippetSchema from '../validations/UpdateSnippetSchema.js';

const router = Router();

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
*               programmingLanguage:
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
*               - programmingLanguage
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
 *     summary: User search/find his own code snippets
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
 *         name: programmingLanguage
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
 *                       programmingLanguage:
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
*                 programmingLanguage:
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
*               programmingLanguage:
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
*                 programmingLanguage:
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
 * /api/public-snippets:
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
 *         name: programmingLanguage
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
 *                       programmingLanguage:
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
router.get('/api/public-snippets',
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
