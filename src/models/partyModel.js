const pool = require("../config/db");

const PartyModel = {
  // ✅ Create new party
  async create(data) {
    const {
      partyName,
      customerName,
      phone,
      email,
      issuedDate,
      dueDate,
      guests,
      status = "registered",
      products = [],
      address
    } = data;

    const productsJSON = JSON.stringify(products);

    const [result] = await pool.query(
      `INSERT INTO parties 
        (partyName, customerName, phone, email, issuedDate, dueDate, guests, status, products, address, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        partyName,
        customerName,
        phone,
        email,
        issuedDate,
        dueDate,
        guests,
        status,
        productsJSON,
        address
      ]
    );

    return this.getById(result.insertId);
  },

  // ✅ Update existing party
  async update(id, data) {
    const {
      partyName,
      customerName,
      phone,
      email,
      issuedDate,
      dueDate,
      guests,
      status,
      products,
      address
    } = data;

    const productsJSON = JSON.stringify(products || []);

    await pool.query(
      `UPDATE parties 
       SET 
         partyName = ?, 
         customerName = ?, 
         phone = ?, 
         email = ?, 
         issuedDate = ?, 
         dueDate = ?, 
         guests = ?, 
         status = ?, 
         products = ?, 
         address = ?, 
         updatedAt = NOW()
       WHERE id = ?`,
      [
        partyName,
        customerName,
        phone,
        email,
        issuedDate,
        dueDate,
        guests,
        status,
        productsJSON,
        address,
        id
      ]
    );

    return this.getById(id);
  },

  // ✅ Get all parties
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM parties ORDER BY createdAt DESC");
    return rows.map((row) => ({
      ...row,
      products: JSON.parse(row.products || "[]")
    }));
  },

  // ✅ Get by ID
  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM parties WHERE id = ?", [id]);
    if (rows.length === 0) return null;

    const party = rows[0];
    return {
      ...party,
      products: JSON.parse(party.products || "[]")
    };
  },

  // ✅ Delete
  async delete(id) {
    const [result] = await pool.query("DELETE FROM parties WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // ✅ Update status only
  async updateStatus(id, status) {
    await pool.query(
      `UPDATE parties SET status = ?, updatedAt = NOW() WHERE id = ?`,
      [status, id]
    );
    return this.getById(id);
  },

  // ✅ Get overdue parties
  async getOverdueParties() {
    const [rows] = await pool.query(
      `SELECT * FROM parties 
       WHERE dueDate < CURDATE() AND status != 'completed'
       ORDER BY dueDate ASC`
    );
    return rows.map((row) => ({
      ...row,
      products: JSON.parse(row.products || "[]")
    }));
  }
};

module.exports = PartyModel;
