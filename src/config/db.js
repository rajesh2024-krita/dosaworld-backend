// src/config/db.js (ESM)
import { createPool } from 'mysql2/promise.js';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rbac_app',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
