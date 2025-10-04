const db = require("../config/db"); // assuming mysql2/promise or wrap it

const Inventory = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM inventory");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM inventory WHERE id = ?", [id]);
    return rows[0]; // return single item
  },

  create: async (item) => {
    const { product, packSize, price, qty, total, status, alertQty } = item;
    const [result] = await db.query(
      "INSERT INTO inventory (product, packSize, price, qty, total, status, alertQty) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [product, packSize, price, qty, total, status, alertQty]
    );
    return { id: result.insertId, ...item };
  },

  update: async (id, item) => {
    const { product, packSize, price, qty, total, status, alertQty } = item;
    const [result] = await db.query(
      "UPDATE inventory SET product=?, packSize=?, price=?, qty=?, total=?, status=?, alertQty=? WHERE id=?",
      [product, packSize, price, qty, total, status, alertQty, id]
    );

    if (result.affectedRows === 0) throw new Error("Item not found");

    const updatedItem = await Inventory.getById(id);
    return updatedItem;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM inventory WHERE id=?", [id]);
    if (result.affectedRows === 0) throw new Error("Item not found");
    return true;
  },
};

module.exports = Inventory;
