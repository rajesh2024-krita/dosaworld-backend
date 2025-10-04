const Inventory = require("../models/inventoryModel");

exports.getInventory = async (req, res) => {
  try {
    const data = await Inventory.getAll();
    res.json({ success: true, message: "Inventory fetched successfully", data });
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ success: false, message: "Failed to fetch inventory", error: err.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item fetched successfully", data: item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch item", error: err.message });
  }
};

exports.createInventory = async (req, res) => {
  try {
    const newItem = await Inventory.create(req.body);
    res.status(201).json({ success: true, message: "Item added successfully", data: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add item", error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const updatedItem = await Inventory.update(req.params.id, req.body);
    res.json({ success: true, message: "Item updated successfully", data: updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message, error: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    await Inventory.delete(req.params.id);
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message, error: err.message });
  }
};
