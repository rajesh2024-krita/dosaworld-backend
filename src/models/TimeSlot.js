const pool = require("../config/db");

const TimeSlot = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM timeslots ORDER BY start_time ASC");
    return rows;
  },

  create: async ({ start_time, end_time }) => {
    const [result] = await pool.query(
      "INSERT INTO timeslots (start_time, end_time) VALUES (?, ?)",
      [start_time, end_time]
    );
    return { id: result.insertId, start_time, end_time };
  },

  update: async (id, { start_time, end_time }) => {
    await pool.query(
      "UPDATE timeslots SET start_time = ?, end_time = ? WHERE id = ?",
      [start_time, end_time, id]
    );
    return { id, start_time, end_time };
  },

  delete: async (id) => {
    await pool.query("DELETE FROM timeslots WHERE id = ?", [id]);
    return { message: "Deleted successfully" };
  }
};

module.exports = TimeSlot;
