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
import followRouter from './routes/follow.route.js';

import passport from 'passport';
import session from 'express-session'
import { Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { TokenService } from './services/token.service.js';
import { UserRepository } from './repositories/user.repository.js';

import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./config.js";


const corsOptions = {
    origin: true, //todo: change it
    credentials: true
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Buscar usuario por googleId o email
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });
      
      if (!user) {
        // Crear nuevo usuario
        user = await User.create({
          name: profile.displayName,
          username: profile.emails[0].value.split('@')[0], // o genera uno único
          email: profile.emails[0].value,
          googleId: profile.id,
          image: profile.photos[0]?.value,
          // password no se incluye
        });
      } else if (!user.googleId) {
        // Usuario existe con email pero sin googleId (registrado con password)
        // Vincular la cuenta de Google
        user.googleId = profile.id;
        if (!user.image && profile.photos[0]?.value) {
          user.image = profile.photos[0].value;
        }
        await user.save();
      }
      
      // Generar tokens JWT
      const jwtAccessToken = jwt.sign(
        { id: user._id, email: user.email }, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: '1h' }
      );

      const jwtRefreshToken = jwt.sign(
        { id: user._id, email: user.email }, 
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Guardar refresh token en la BD
      await TokenService.create({
        refreshToken: jwtRefreshToken,
        userId: user._id,
        userEmail: user.email
      });

      // Pasar usuario y tokens
      return cb(null, { 
        user, 
        accessToken: jwtAccessToken, 
        refreshToken: jwtRefreshToken 
      });
      
    } catch (error) {
      return cb(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


// app.use(authMiddleware);

// routes
app.use('/users', usersRouter);
app.use('/tokens', tokensRouter);
app.use('/posts', postsRouter);
app.use('/post-likes', postLikesRouter);
app.use('/post-comments', postCommentsRouter);
app.use('/post-comment-likes', postCommentLikesRouter);
app.use('/follow', followRouter);


//AUTH WITH GOOGLE
app.get('/auth/google', passport.authenticate('google', { scope: [ 'profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: 'http://localhost:5173/login' 
  }), 
  (req, res) => {
    const { accessToken, refreshToken } = req.user;

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .redirect(`http://localhost:5173/app/home/${req.user?.user?._id}`);
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:5173/login');
});


//TESTING:
app.get('/users', authMiddleware, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.listen(PORT, () => {
  console.log(`El servidor está levantado! http://localhost:${PORT}`);
});