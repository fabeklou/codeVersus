import { Router } from 'express';
import SubmitCode from '../controllers/SubmitCode.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import CodeSubmissionSchema from '../validations/codeSubmissionSchema.js';
import checkAuthStatus from '../middlewares/checkAuthStatus.js';
import snippetSchema from '../validations/snippetSchema.js';
import CodeSnippet from '../controllers/CodeSnippet.js';

const router = Router();

/** Code submission routes */

router.post('/api/submissions',
  requestDataValidation(CodeSubmissionSchema),
  checkAuthStatus,
  SubmitCode.submissions);

/** Snippet routes */

router.post('/api/snippets/save',
  requestDataValidation(snippetSchema),
  checkAuthStatus,
  CodeSnippet.saveCodeSnippet);

export default router;
