import express from "express";
import cors from "cors";
import { config } from "./config.js";

const corsOptions = {
    origin: true, //cambiar
    credentials: true
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

//conexión a la base de datos
// TODO

// rutas
app.get('/', (req, res) => {
    res.send('Todo ok!');
});

const port = config.port;

app.listen(port, () => {
    console.log(`El servidor está levantado! http://localhost:${port}`);
})