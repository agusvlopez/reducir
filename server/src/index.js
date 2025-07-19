import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import { PORT, SALT_ROUNDS } from "./config.js";
import 'dotenv/config';

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

const users = []

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);  
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post('/login', async (req, res) => {
  const user = users.find(user => user.username = req.body.username);
  if(user == null) {
    return res.status(400).send('Cannot find user');
  }

  try {
    const response = await bcrypt.compare(req.body.password, user.password);
    if (response) {
      res.status(200).send('Success');
    } else {
      res.status(403).send('Not Allowed');
    }

  } catch (err) {
    res.status(500).send('Internal server error');
  }
});


app.listen(PORT, () => {
    console.log(`El servidor está levantado! http://localhost:${PORT}`);
});