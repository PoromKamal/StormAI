import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from "http";
import router from './routes/aiRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/ai", router);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});