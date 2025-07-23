import 'dotenv/config';
import './databases/mongoDBConnection.js';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import { JWT_KEY_SECRET, PORT, SALT_ROUNDS } from "./config.js";
import User from "./models/User.js";
import usersRouter from './routes/user.route.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const corsOptions = {
    origin: true, //todo: change it
    credentials: true
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// app.use(authMiddleware);

// routes
app.use('/users', usersRouter);

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.listen(PORT, () => {
    console.log(`El servidor está levantado! http://localhost:${PORT}`);
});