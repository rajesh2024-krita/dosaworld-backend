import pool from './config/db.js';

try {
  const [rows] = await pool.query("SELECT DATABASE() AS db");
  console.log("Connected to DB:", rows[0].db);
} catch (err) {
  console.error("DB connection error:", err.message);
}
