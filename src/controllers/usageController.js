// controllers/usageController.js
const Inventory = require("../models/inventoryModel");
const Usage = require("../models/Usage"); // make sure casing matches your file

// Get all usage records
const getUsage = async (req, res) => {
  try {
    const results = await Usage.getAll();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get usage by ID
const getUsageById = async (req, res) => {
  try {
    const { id } = req.params;
    const usage = await Usage.getById(id);
    if (!usage) return res.status(404).json({ message: "Usage not found" });
    res.json({ success: true, data: usage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create usage
const createUsage = async (req, res) => {
  try {
    const { inventoryId, usedQty, date, product } = req.body;

    // Optional: fetch inventory to get product name if not provided
    let inventoryItem = null;
    if (!product) {
      inventoryItem = await Inventory.getById(inventoryId);
      if (!inventoryItem) return res.status(404).json({ message: "Inventory not found" });
    }

    const usageResult = await Usage.create({
      inventoryId,
      usedQty,
      date,
      product: product || inventoryItem.product,
    });

    res.status(201).json({ success: true, data: usageResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete usage
const deleteUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usage.delete(id);
    if (!deleted) return res.status(404).json({ message: "Usage not found" });
    res.json({ success: true, message: "Usage deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getUsage, getUsageById, createUsage, deleteUsage };
