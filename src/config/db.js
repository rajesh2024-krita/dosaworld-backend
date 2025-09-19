// src/config/db.js (CommonJS)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: 'srv1545.hstgr.io',
  user: 'u180373631_dosaworld',
  password: 'Dosa@2025!wd',
  database: 'u180373631_dosaworld',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
