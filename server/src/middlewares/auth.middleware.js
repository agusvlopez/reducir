import jwt from 'jsonwebtoken';
import { JWT_KEY_SECRET } from '../config.js';

/**
 * Middleware to check for a valid JWT in cookies.
 * If a valid token is found, it populates `req.user` with the payload.
 * If the token is invalid, it clears the cookie.
 * This middleware does NOT block requests if the user is not authenticated.
 */
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  req.user = null;

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_KEY_SECRET);
      req.user = payload; 
    } catch (err) {
      res.clearCookie('access_token');
    }
  }
  next();
}