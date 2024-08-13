import { Router } from 'express';
import SubmitCode from '../controllers/SubmitCode.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import CodeSubmissionSchema from '../validations/codeSubmissionSchema.js';
import checkAuthStatus from '../middlewares/checkAuthStatus.js';
import FetchSubmissionResult from '../controllers/FetchSubmissionResult.js';
const router = Router();

router.post('/api/submissions',
  requestDataValidation(CodeSubmissionSchema),
  checkAuthStatus,
  SubmitCode.submissions);

export default router;
