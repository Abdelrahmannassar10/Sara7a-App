import express from 'express';
import { bootstrap } from './app.controller.js';
const app = express();
const PORT = 3000;
bootstrap(express, app);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});