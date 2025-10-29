import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Iniciar autenticación con Google
authRouter.get(
  '/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
authRouter.get(
  '/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: 'http://localhost:5173/login' 
  }), 
  AuthController.googleCallback
);

// Logout
  //todo: its not necessary, its already done in user
authRouter.get('/logout', AuthController.logout);

export default authRouter;