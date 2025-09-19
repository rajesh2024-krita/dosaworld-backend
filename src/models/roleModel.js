const pool = require("../config/db");

const findRoleByName = async (roleName) => {
  const [rows] = await pool.query(
    "SELECT * FROM rbac_roles WHERE name = ?",
    [roleName]
  );
  return rows[0];
};

module.exports = { findRoleByName };
