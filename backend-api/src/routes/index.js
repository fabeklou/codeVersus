import { Router } from 'express';
import codeExecutionRoutes from './codeExecutionRoutes.js';
import usersRoutes from './usersRoutes.js';
import snippetsRoutes from './snippetsRoutes.js';

const router = Router();

/** Code submission routes */
router.use(codeExecutionRoutes);

/** User profile routes */
router.use(usersRoutes);

/** Snippet routes */
router.use(snippetsRoutes);

export default router;
