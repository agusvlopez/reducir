import 'dotenv/config';

import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import { PORT, SALT_ROUNDS } from "./config.js";
import User from "./models/users.js";
import './database/mongoDBConnection.js';

const corsOptions = {
    origin: true, //todo: change it
    credentials: true
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('Todo ok!');
});

app.get('/users', async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.post('/users', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);  
    const user = { 
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,      
      password: hashedPassword,
      carbon: 0,
      achievements: [],
      actions: [],
      followers: [],
      following: []
    };

    await User.create(user);
    
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post('/login', async (req, res) => {
  const user = await User.find({email: req.body.email});

  if(!user[0]) {
    return res.status(400).send('Cannot find user');
  }

  try {
    const response = await bcrypt.compare(req.body.password, user[0].password);
        
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