const Inventory = require("../models/inventoryModel");

// Get all inventory items
exports.getInventory = (req, res) => {
  Inventory.getAll((err, results) => {
    if (err) {
      console.error("❌ Error fetching inventory:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch inventory", error: err });
    }
    res.json({ success: true, message: "Inventory fetched successfully", data: results });
  });
};

// Get inventory by ID
exports.getInventoryById = (req, res) => {
  const { id } = req.params;
  Inventory.getById(id, (err, results) => {
    if (err) {
      console.error(`❌ Error fetching inventory for ID ${id}:`, err);
      return res.status(500).json({ success: false, message: "Failed to fetch item", error: err });
    }
    if (!results.length) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item fetched successfully", data: results[0] });
  });
};

// Create new inventory item
exports.createInventory = (req, res) => {
  const newItem = req.body;
  Inventory.create(newItem, (err, results) => {
    if (err) {
      console.error("❌ Error creating inventory item:", err);
      return res.status(500).json({ success: false, message: "Failed to add item", error: err });
    }
    res.json({ success: true, message: "Item added successfully", id: results.insertId });
  });
};

// Update inventory item
exports.updateInventory = (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;

  Inventory.update(id, updatedItem, (err) => {
    if (err) {
      console.error(`❌ Error updating inventory item ID ${id}:`, err);
      return res.status(500).json({ success: false, message: "Failed to update item", error: err });
    }

    // Fetch updated item to return in response
    Inventory.getById(id, (err2, results) => {
      if (err2) {
        console.error(`❌ Error fetching updated inventory item ID ${id}:`, err2);
        return res.status(500).json({ success: false, message: "Updated but failed to fetch item", error: err2 });
      }
      res.json({ success: true, message: "Item updated successfully", data: results[0] });
    });
  });
};

// Delete inventory item
exports.deleteInventory = (req, res) => {
  const { id } = req.params;
  Inventory.delete(id, (err) => {
    if (err) {
      console.error(`❌ Error deleting inventory item ID ${id}:`, err);
      return res.status(500).json({ success: false, message: "Failed to delete item", error: err });
    }
    res.json({ success: true, message: "Item deleted successfully" });
  });
};
