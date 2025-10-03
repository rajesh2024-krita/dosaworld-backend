// models/Usage.js
const db = require("../config/db"); // mysql2/promise connection

const Usage = {
  // Get all usage records
  getAll: async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM `usage` ORDER BY date DESC"
      );
      return rows;
    } catch (err) {
      console.error("Error fetching usage:", err);
      return [];
    }
  },


  // Get usage by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT id, inventoryId, usedQty, date, product FROM `usage` WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error("Error fetching usage by ID:", err);
      return null;
    }
  },

  // Create a usage record and reduce inventory
  create: async ({ inventoryId, usedQty, date, product }) => {
  try {
    // 1. Get current inventory data
    const [inventoryRows] = await db.query(
      "SELECT * FROM inventory WHERE id = ?",
      [inventoryId]
    );

    if (inventoryRows.length === 0) {
      return { success: false, message: "Inventory not found" };
    }

    const currentQty = inventoryRows[0].qty;

    // 2. Check stock
    const newQty = currentQty - usedQty;
    if (newQty < 0) {
      return { success: false, message: `Insufficient stock. Current stock: ${currentQty}` };
    }

    // 3. Insert usage record
    const [usageResult] = await db.query(
      "INSERT INTO `usage` (inventoryId, usedQty, date, product) VALUES (?, ?, ?, ?)",
      [inventoryId, usedQty, date, product]
    );

    // 4. Update inventory quantity
    await db.query(
      "UPDATE inventory SET qty = ? WHERE id = ?",
      [newQty, inventoryId]
    );

    // 5. Fetch the newly created usage record
    const [rows] = await db.query(
      "SELECT id, inventoryId, usedQty, date, product FROM `usage` WHERE id = ?",
      [usageResult.insertId]
    );

    // 6. Return success message and usage data
    return {
      success: true,
      message: "Usage recorded and inventory updated successfully",
      data: rows[0],
    };

  } catch (err) {
    console.error("Error creating usage:", err);
    return { success: false, message: err.message };
  }
},



  // Delete a usage record
  delete: async (id) => {
    const [result] = await db.query("DELETE FROM `usage` WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Usage;
