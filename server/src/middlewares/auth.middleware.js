import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config.js';

export const authMiddleware = (req, res, next) => {
  // Access token must be sent in the Authorization header as a Bearer token
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Acceso no autorizado. Se requiere iniciar sesión.' });
  }

  try {
    const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'La sesión ha expirado. Por favor, inicie sesión de nuevo.' });
    }

    return res.status(401).json({ message: 'Token inválido o corrupto.' });
  }
}