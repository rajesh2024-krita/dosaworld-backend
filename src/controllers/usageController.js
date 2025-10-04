const Inventory = require("../models/inventoryModel");
const Usage = require("../models/Usage");

// Get all usage records
const getUsage = async (req, res) => {
  try {
    const results = await Usage.getAll();
    res.json({ success: true, message: "Usage fetched successfully", data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch usage", error: err.message });
  }
};

// Get usage by ID
const getUsageById = async (req, res) => {
  try {
    const { id } = req.params;
    const usage = await Usage.getById(id);
    if (!usage) return res.status(404).json({ success: false, message: "Usage not found" });
    res.json({ success: true, message: "Usage fetched successfully", data: usage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch usage", error: err.message });
  }
};

// Create usage
const createUsage = async (req, res) => {
  try {
    const { inventoryId, usedQty, date, product } = req.body;

    let inventoryItem = null;
    if (!product) {
      const invRows = await Inventory.getById(inventoryId);
      inventoryItem = invRows[0];
      if (!inventoryItem) return res.status(404).json({ success: false, message: "Inventory not found" });
    }

    const usageResult = await Usage.create({
      inventoryId,
      usedQty,
      date: date || new Date().toISOString(),
      product: product || inventoryItem.product,
    });

    res.status(201).json({ success: true, message: "Usage recorded successfully", data: usageResult });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create usage", error: err.message });
  }
};

// Delete usage
const deleteUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usage.delete(id);

    if (!deleted || deleted.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Usage not found" });
    }

    res.json({ success: true, message: "Usage deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete usage", error: err.message });
  }
};

module.exports = { getUsage, getUsageById, createUsage, deleteUsage };
