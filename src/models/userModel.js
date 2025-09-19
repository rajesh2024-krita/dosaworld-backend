const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM rbac_users WHERE email = ?",
    [email]
  );
  return rows[0];
};

const createUser = async (user) => {
  const [result] = await pool.query(
    "INSERT INTO rbac_users (name, email, password, role, status, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [user.name, user.email, user.password, user.role, "active", new Date(), new Date()]
  );
  return { id: result.insertId, ...user };
};

const updateLastLogin = async (id) => {
  await pool.query(
    "UPDATE rbac_users SET lastLogin = ? WHERE id = ?",
    [new Date(), id]
  );
};

const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, name, email, password, role, status, lastLogin, createdAt FROM rbac_users"
  );
  return rows;
};

const getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, password, role, status, lastLogin, createdAt FROM rbac_users WHERE id = ?",
    [id]
  );
  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  updateLastLogin,
  getAllUsers,
  getUserById
};
