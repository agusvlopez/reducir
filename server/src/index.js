import 'dotenv/config';
import './databases/mongoDBConnection.js';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./config.js";
import User from "./models/User.js";
import usersRouter from './routes/user.route.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import tokensRouter from './routes/token.route.js';
import postsRouter from './routes/post.route.js';
import postLikesRouter from './routes/postLike.route.js';
import postCommentsRouter from './routes/postComment.route.js';
import postCommentLikesRouter from './routes/postCommentLike.route.js';

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
app.use('/tokens', tokensRouter);
app.use('/posts', postsRouter);
app.use('/post-likes', postLikesRouter);
app.use('/post-comments', postCommentsRouter);
app.use('/post-comment-likes', postCommentLikesRouter);

//TESTING:
app.get('/users', authMiddleware, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.listen(PORT, () => {
    console.log(`El servidor está levantado! http://localhost:${PORT}`);
});