const Inventory = require("../models/inventoryModel");

exports.getInventory = (req, res) => {
  Inventory.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getInventoryById = (req, res) => {
  const { id } = req.params;
  Inventory.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
};

exports.createInventory = (req, res) => {
  const newItem = req.body;
  Inventory.create(newItem, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item added", id: results.insertId });
  });
};

exports.updateInventory = (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  Inventory.update(id, updatedItem, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item updated" });
  });
};

exports.deleteInventory = (req, res) => {
  const { id } = req.params;
  Inventory.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Item deleted" });
  });
};
