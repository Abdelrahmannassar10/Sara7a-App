import express from 'express';
import { bootstrap } from './app.controller.js';
const app = express();
const PORT = process.env.PORT;
bootstrap(express, app);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});