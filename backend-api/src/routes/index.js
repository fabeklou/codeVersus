import { Router } from 'express';
import SubmitCode from '../controllers/SubmitCode.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import CodeSubmissionSchema from '../validations/codeSubmissionSchema.js';
import snippetSchema from '../validations/snippetSchema.js';
import CodeSnippet from '../controllers/CodeSnippet.js';

const router = Router();

/** Code submission routes */

router.post('/api/submissions',
  requestDataValidation(CodeSubmissionSchema),
  SubmitCode.submissions);

/** Snippet routes */

router.post('/api/snippets/save',
  requestDataValidation(snippetSchema),
  CodeSnippet.saveCodeSnippet);

export default router;
