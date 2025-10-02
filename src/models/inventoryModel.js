const db = require("../config/db");

const Inventory = {
  getAll: (callback) => {
    db.query("SELECT * FROM inventory", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM inventory WHERE id = ?", [id], callback);
  },

  create: (item, callback) => {
    const { product, packSize, price, qty, total, status } = item;
    db.query(
      "INSERT INTO inventory (product, packSize, price, qty, total, status) VALUES (?, ?, ?, ?, ?, ?)",
      [product, packSize, price, qty, total, status],
      callback
    );
  },

  update: (id, item, callback) => {
    const { product, packSize, price, qty, total, status } = item;
    db.query(
      "UPDATE inventory SET product=?, packSize=?, price=?, qty=?, total=?, status=? WHERE id=?",
      [product, packSize, price, qty, total, status, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query("DELETE FROM inventory WHERE id=?", [id], callback);
  }
};

module.exports = Inventory;
