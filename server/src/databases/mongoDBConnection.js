import mongoose from "mongoose"
import { ConnectionError } from "../errors/ConnectionError.js";

mongoose.connect(process.env.MONGO_URI ?? '', {
  dbName: 'reducir'
})
 .then(() => {
   console.log('✅ MongoDB Atlas conectado')
  })
  .catch((error) => {
    throw new ConnectionError('No se pudo conectar a la base de datos.');
  })
