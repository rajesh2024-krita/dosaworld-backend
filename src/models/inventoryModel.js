const db = require("../config/db");

const Inventory = {
  getAll: (callback) => {
    db.query("SELECT * FROM inventory", callback);
  },

  getById: (inventoryId, callback) => {
    db.query("SELECT * FROM inventory WHERE id = ?", [inventoryId], callback);
  },

  create: (item, callback) => {
    const { product, packSize, price, qty, total, status, alertQty } = item;
    db.query(
      "INSERT INTO inventory (product, packSize, price, qty, total, status, alertQty) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [product, packSize, price, qty, total, status, alertQty],
      callback
    );
  },

  update: (id, item, callback) => {
    const { product, packSize, price, qty, total, status, alertQty } = item;
    db.query(
      "UPDATE inventory SET product=?, packSize=?, price=?, qty=?, total=?, status=?, alertQty=? WHERE id=?",
      [product, packSize, price, qty, total, status, alertQty, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM inventory WHERE id=?", [id], callback);
  }
};

module.exports = Inventory;
