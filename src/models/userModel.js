import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM rbac_users WHERE email = ?", [email]);
  return rows[0];
};

export const createUser = async (user) => {
  const [result] = await pool.query(
    "INSERT INTO rbac_users (name, email, password, role, status, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [user.name, user.email, user.password, user.role, "active", new Date(), new Date()]
  );
  return { id: result.insertId, ...user };
};

export const updateLastLogin = async (id) => {
  await pool.query("UPDATE rbac_users SET lastLogin = ? WHERE id = ?", [new Date(), id]);
};

export async function getAllUsers() {
  const [rows] = await pool.query(
    "SELECT id, name, email, password, role, status, lastLogin, createdAt FROM rbac_users"
  );
  return rows;
}

export async function getUserById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, password, role, status, lastLogin, createdAt FROM rbac_users WHERE id = ?",
    [id]
  );
  return rows[0];
}