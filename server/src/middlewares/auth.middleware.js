import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config.js';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado. Se requiere iniciar sesión.' });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
    req.user = payload;

    next();
  } catch (err) {
    res.clearCookie('access_token');

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'La sesión ha expirado. Por favor, inicie sesión de nuevo.' });
    }

    return res.status(401).json({ message: 'Token inválido o corrupto.' });
  }
}