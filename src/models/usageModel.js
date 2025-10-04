const db = require("../config/db"); // mysql2/promise connection

const Usage = {
  // Get all usage records
  getAll: async () => {
    try {
      const [rows] = await db.query("SELECT * FROM `usage`");
      return rows; // returns an array of usage records
    } catch (err) {
      console.error("Error fetching usage:", err);
      throw err; // throw error so caller can handle
    }
  },

  // Get usage by ID with inventory info
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        `SELECT u.id, u.inventoryId, u.usedQty, u.date, u.product,
                i.product AS inventoryProduct, i.qty AS inventoryQty
         FROM \`usage\` u
         JOIN inventory i ON u.inventoryId = i.id
         WHERE u.id = ?`,
        [id]
      );
      return rows[0] || null; // returns single usage object or null
    } catch (err) {
      console.error(`Error fetching usage ID ${id}:`, err);
      throw err;
    }
  },

  // Create a usage record and reduce inventory in one step
  create: async ({ inventoryId, usedQty, date, product }) => {
    try {
      // 1. Get current inventory data
      const [inventoryRows] = await db.query(
        "SELECT * FROM inventory WHERE id = ?",
        [inventoryId]
      );

      if (inventoryRows.length === 0) {
        throw new Error("Inventory not found");
      }

      const currentQty = Number(inventoryRows[0].qty);

      // 2. Calculate new quantity
      const newQty = currentQty - usedQty;
      if (newQty < 0) {
        throw new Error(`Insufficient stock. Current stock: ${currentQty}`);
      }

      // 3. Insert usage record
      const [usageResult] = await db.query(
        "INSERT INTO `usage` (inventoryId, usedQty, date, product) VALUES (?, ?, ?, ?)",
        [inventoryId, usedQty, date, product]
      );

      // 4. Update inventory quantity
      await db.query("UPDATE inventory SET qty = ? WHERE id = ?", [newQty, inventoryId]);

      // 5. Return the newly created usage with inventory info
      const [rows] = await db.query(
        `SELECT u.id, u.inventoryId, u.usedQty, u.date, u.product,
                i.product AS inventoryProduct, i.qty AS inventoryQty
         FROM \`usage\` u
         JOIN inventory i ON u.inventoryId = i.id
         WHERE u.id = ?`,
        [usageResult.insertId]
      );

      return rows[0]; // returns the created usage record
    } catch (err) {
      console.error("Error creating usage:", err);
      throw err;
    }
  },

  // Delete a usage record
  delete: async (id) => {
    try {
      const [result] = await db.query("DELETE FROM `usage` WHERE id = ?", [id]);
      return result; // returns affectedRows, etc.
    } catch (err) {
      console.error(`Error deleting usage ID ${id}:`, err);
      throw err;
    }
  },
};

module.exports = Usage;
