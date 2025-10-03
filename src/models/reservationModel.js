const pool = require("../config/db");

const ReservationModel = {
  async create(data) {
    const { first_name, last_name, phone, email, party_size, date, time } =
      data;
    const [result] = await pool.query(
      `INSERT INTO reservations (first_name, last_name, phone, email, party_size, date, time) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, phone, email, party_size, date, time]
    );
    return this.getById(result.insertId);
  },

  async update(id, data) {
    const { first_name, last_name, phone, email, party_size, date, time } =
      data;
    await pool.query(
      `UPDATE reservations 
     SET first_name = ?, last_name = ?, phone = ?, email = ?, party_size = ?, date = ?, time = ? 
     WHERE id = ?`,
      [first_name, last_name, phone, email, party_size, date, time, id]
    );
    return this.getById(id);
  },

  async getAll(filters) {
    const conditions = [];
    const params = [];

    if (filters.party_size) {
      if (filters.party_size === "7+" || Number(filters.party_size) >= 7) {
        conditions.push("party_size >= ?");
        params.push(7);
      } else {
        conditions.push("party_size = ?");
        params.push(Number(filters.party_size));
      }
    }
    if (filters.date) {
      conditions.push("date = ?");
      params.push(filters.date);
    }
    if (filters.time) {
      conditions.push("time = ?");
      params.push(filters.time);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT id, first_name, last_name, phone, email, party_size, date, time 
               FROM reservations ${where} ORDER BY id DESC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, phone, email, party_size, date, time 
     FROM reservations WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const [result] = await pool.query("DELETE FROM reservations WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = ReservationModel;
