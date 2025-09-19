// src/config/db.js (ESM)
import { createPool } from 'mysql2/promise.js';

const pool = createPool({
  host: 'srv1545.hstgr.io',
  user: 'u180373631_dosaworld',
  password: 'Dosa@2025!wd',
  database: 'u180373631_dosaworld',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
