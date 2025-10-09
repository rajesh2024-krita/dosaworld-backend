const pool = require("../config/db");

const TimeSlot = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM timeslots ORDER BY start_time ASC");
    return rows;
  },

  // Check if a timeslot exists
  exists: async ({ start_time, end_time }, excludeId = null) => {
    let query = "SELECT COUNT(*) as count FROM timeslots WHERE start_time = ? AND end_time = ?";
    const params = [start_time, end_time];

    // exclude current id for updates
    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count > 0;
  },

  create: async (data) => {
    const { start_time, end_time } = data;

    // Check for duplicates
    const exists = await TimeSlot.exists({ start_time, end_time });
    if (exists) {
      throw new Error("Time slot already exists.");
    }

    const [result] = await pool.query(
      "INSERT INTO timeslots (start_time, end_time) VALUES (?, ?)",
      [start_time, end_time]
    );
    return { id: result.insertId, start_time, end_time };
  },

  update: async (id, data) => {
    const { start_time, end_time } = data;

    // Check for duplicates excluding current id
    const exists = await TimeSlot.exists({ start_time, end_time }, id);
    if (exists) {
      throw new Error("Time slot already exists.");
    }

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
