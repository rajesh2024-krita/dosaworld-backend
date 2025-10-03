const express = require("express");
const Inventory = require("../models/inventoryModel");
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController");

const router = express.Router();

// Middleware to ensure numeric fields are numbers
const sanitizeInventory = (req, res, next) => {
  req.body.price = Number(req.body.price) || 0;
  req.body.qty = Number(req.body.qty) || 0;
  req.body.alertQty = Number(req.body.alertQty) || 0;
  next();
};

// ---------- Inventory Routes ----------
router.get("/", getInventory);
router.get("/:id", getInventoryById);
router.post("/", sanitizeInventory, createInventory);
router.put("/:id", sanitizeInventory, updateInventory);
router.delete("/:id", deleteInventory);

// Get low stock items
router.get("/low-stock", (req, res) => {
  Inventory.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    const lowStock = results.filter(item => Number(item.qty) <= Number(item.alertQty));
    res.json(lowStock);
  });
});

module.exports = router;
