import pool from "../config/db.js";

export const findRoleByName = async (roleName) => {
  const [rows] = await pool.query("SELECT * FROM rbac_roles WHERE name = ?", [roleName]);
  return rows[0];
};
