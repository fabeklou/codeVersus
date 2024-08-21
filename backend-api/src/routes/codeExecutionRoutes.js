import { Router } from 'express';
import SubmitCode from '../controllers/SubmitCode.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import CodeSubmissionSchema from '../validations/codeSubmissionSchema.js';

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

export default router;
