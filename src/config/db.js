// src/config/db.js (CommonJS)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: '31.97.36.171',
  user: 'root',
  password: 'Dosa@world2025',
  database: 'dosaworld',
  waitForConnections: true,
  connectionLimit: 10
});

// const pool = mysql.createPool({
//   host: 'srv1545.hstgr.io',
//   user: 'u180373631_dosaworld',
//   password: 'Dosa@2025!wd',
//   database: 'u180373631_dosaworld',
//   waitForConnections: true,
//   connectionLimit: 10
// });

module.exports = pool;
