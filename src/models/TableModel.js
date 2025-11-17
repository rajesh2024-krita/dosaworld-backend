const pool = require("../config/db"); // mysql2/promise

const TableModel = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM reservation_table ORDER BY id ASC");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM reservation_table WHERE id = ?", [id]);
    return rows[0]; // single row
  },

  create: async (data) => {
    const [result] = await pool.query(
      "INSERT INTO reservation_table (table_no, seats) VALUES (?, ?)",
      [data.table_no, data.seats]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    await pool.query(
      "UPDATE reservation_table SET table_no=?, seats=? WHERE id=?",
      [data.table_no, data.seats, id]
    );
    return { id, ...data };
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM reservation_table WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = TableModel;
