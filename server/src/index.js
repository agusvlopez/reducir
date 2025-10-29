import 'dotenv/config';
import './databases/mongoDBConnection.js';

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from 'express-session';
import passport from 'passport';

import { PORT } from "./config.js";
import { configurePassport } from './config/passport.config.js';

// Routers
import usersRouter from './routes/user.route.js';
import tokensRouter from './routes/token.route.js';
import postsRouter from './routes/post.route.js';
import postLikesRouter from './routes/postLike.route.js';
import postCommentsRouter from './routes/postComment.route.js';
import postCommentLikesRouter from './routes/postCommentLike.route.js';
import followRouter from './routes/follow.route.js';
import authRouter from './routes/auth.route.js';

const corsOptions = {
  origin: true, //todo: change it
  credentials: true
};

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Configurar Passport
configurePassport();

// Routes
app.use('/users', usersRouter);
app.use('/tokens', tokensRouter);
app.use('/posts', postsRouter);
app.use('/post-likes', postLikesRouter);
app.use('/post-comments', postCommentsRouter);
app.use('/post-comment-likes', postCommentLikesRouter);
app.use('/follow', followRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`El servidor está levantado! http://localhost:${PORT}`);
});