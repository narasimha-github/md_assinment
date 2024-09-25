import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken'

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, 'todo.db');
let database = null;


const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database
    });

    await database.run(`
      CREATE TABLE IF NOT EXISTS login (
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT,
        prime BOOLEAN
      );
    `);
    console.log('Login table created successfully');

    await database.run(`
      CREATE TABLE IF NOT EXISTS todo (
        id TEXT PRIMARY KEY NOT NULL,
        task TEXT
      );
    `);
    console.log('Todo table created successfully');

    app.listen(4000, () => {
      console.log('Server running at port 4000');
    });
  } catch (error) {
    console.error('Error initializing the database and server:', error.message);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post('/signin', async (req, res) => {
    const { name, email, password, prime } = req.body;
  
    try {
      const userQuery = `SELECT * FROM login WHERE email = ?`;
      const dbUser = await database.get(userQuery, [email]);
  
      if (dbUser === undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUserQuery = `
          INSERT INTO login (name, email, password, prime) 
          VALUES (?, ?, ?, ?)
        `;
        await database.run(createUserQuery, [name, email, hashedPassword, prime]);
  
        res.status(201).json({ message: 'User created successfully' });

      } else {
        res.status(409).json({ message: 'User already exists' });
      }
    } catch (error) {
      console.error('Error signing in user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userQuery = `SELECT * FROM login WHERE email = ?`;
      const dbUser = await database.get(userQuery, [email]);
  
      if (dbUser === undefined) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        if (isPasswordValid) {
            const SECRET_KEY = 'Your-login'
          const token = jwt.sign({ email: dbUser.email }, SECRET_KEY);
          res.status(200).json({token,message: 'Login Success'});
        } else {
          res.status(401).json({ message: 'Invalid password' });
        }
      }
    } catch (error) {
      console.error('Error logging in user:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default app;