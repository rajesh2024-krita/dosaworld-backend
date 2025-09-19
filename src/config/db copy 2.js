// src/config/db.js (ESM)
import { createPool } from 'mysql2/promise.js';
import dotenv from 'dotenv';
import { resolve } from "path";


dotenv.config({ path: './.env' });

console.log("CWD:", process.cwd());
console.log("Resolved .env path:", resolve("../.env"));

console.log("ENV:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_DATABASE
});


const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
});

export default pool;
