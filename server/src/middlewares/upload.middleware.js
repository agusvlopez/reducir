// middlewares/upload.js
import multer from 'multer';

// Configuración de Multer para memoria (no guarda en disco)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'));
    }
  }
});

// Middleware para procesar la imagen del post
export const uploadPostImage = upload.single('image');

// Si necesitas múltiples imágenes en el futuro:
// export const uploadMultipleImages = upload.array('images', 5); // máximo 5