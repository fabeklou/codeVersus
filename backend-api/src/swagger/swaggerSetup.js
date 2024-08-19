import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();
const apiUrl = process.env.BACKEND_API_URL;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '⚔️ Code Versus API',
      version: '0.0.1',
      description: 'API for Code Versus, a platform for developers to compete in coding challenges, share code snippets, and more.',
      contact: {
        name: 'Komlanvi Fabrice Eklou'
      },
    },
    servers: [
      {
        url: apiUrl
      }
    ],
  },
  apis: [
    './src/auth/index.js',
    './src/routes/*.js',
  ]
}

const swaggerDocs = swaggerjsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;
