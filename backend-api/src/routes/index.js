import { Router } from 'express';
import SubmitCode from '../controllers/SubmitCode.js';
import requestDataValidation from '../middlewares/requestDataValidation.js';
import CodeSubmissionSchema from '../validations/codeSubmissionSchema.js';
import snippetSchema from '../validations/snippetSchema.js';
import CodeSnippet from '../controllers/CodeSnippet.js';
import UpdateProfileSchema from '../validations/updateProfileSchema.js';
import UserProfile from '../controllers/UserProfile.js';
import UpdateSnippetSchema from '../validations/UpdateSnippetSchema.js';

const router = Router();

/** Code submission routes */

router.post('/api/submissions',
  requestDataValidation(CodeSubmissionSchema),
  SubmitCode.submissions);

/** User profile routes */

router.get('/api/users/profile/:username',
  UserProfile.getProfile);

router.put('/api/users/profile',
  requestDataValidation(UpdateProfileSchema),
  UserProfile.updateProfile);

/** Snippet routes */

router.post('/api/snippets',
  requestDataValidation(snippetSchema),
  CodeSnippet.saveCodeSnippet);

router.get('/api/snippets',
  CodeSnippet.getCodeSnippets);

router.get('/api/snippets/:snippetId',
  CodeSnippet.getCodeSnippetById);

router.put('/api/snippets/:snippetId',
  requestDataValidation(UpdateSnippetSchema),
  CodeSnippet.updateCodeSnippetById);

router.delete('/api/snippets/:snippetId',
  CodeSnippet.deleteCodeSnippetById);

router.get('/api/snippets/link/:snippetId',
  CodeSnippet.getCodeSnippetLink);

router.get('/api/snippets/link/:privateLink',
  CodeSnippet.getCodeSnippetFromLink);

router.patch('/api/snippets/link/:snippetId',
  CodeSnippet.removeCodeSnippetLink);

router.get('/api/snippets/public',
  CodeSnippet.getPublicCodeSnippets);

router.patch('/api/snippets/like/:snippetId',
  CodeSnippet.likeUnlikeCodeSnippet);

export default router;
