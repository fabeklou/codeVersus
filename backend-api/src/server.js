import express from 'express';
import authRoutesMapper from './auth/index.js';

const app = express();
const port = process.env.EXPRESS_PORT || 5050;

app.use(express.json());
authRoutesMapper(app);

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
