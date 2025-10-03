// models/Usage.js
const db = require("../config/db"); // mysql2/promise connection

const Usage = {
    // Get all usage records with inventory info
    getAll: async () => {
        try {
            const [rows] = await db.query(
                `SELECT * FROM usage`
            );
            return rows;
        } catch (err) {
            console.error("Error fetching usage:", err);
            return [];
        }
    },

    // Get usage by ID with inventory info
    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT u.id, u.inventoryId, u.usedQty, u.date, u.product,
              i.product AS inventoryProduct, i.qty AS inventoryQty
       FROM \`usage\` u
       JOIN inventory i ON u.inventoryId = i.id
       WHERE u.id = ?`,
            [id]
        );
        return rows[0];
    },

    // Create a usage record and reduce inventory in one step
    create: async ({ inventoryId, usedQty, date, product }) => {
        // 1. Get current inventory data
        console.log("inventoryId === ", inventoryId);

        const [inventoryRows] = await db.query(
            "SELECT * FROM inventory WHERE id = ?",
            [inventoryId]
        );

        if (inventoryRows.length === 0) {
            throw new Error("Inventory not found");
        }

        const currentQty = inventoryRows[0].qty;
        console.log("currentQty == ", currentQty);
        console.log("usedQty == ", usedQty);

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

        // 4. Update inventory with new quantity
        const [inventoryResult] = await db.query(
            "UPDATE inventory SET qty = ? WHERE id = ?",
            [newQty, inventoryId]
        );

        // 5. Return usage with updated inventory info
        const [rows] = await db.query(
            `SELECT u.id, u.inventoryId, u.usedQty, u.date, u.product,
            i.product AS inventoryProduct, i.qty AS inventoryQty
     FROM \`usage\` u
     JOIN inventory i ON u.inventoryId = i.id
     WHERE u.id = ?`,
            [usageResult.insertId]
        );

        return rows[0];
    },


    // Delete a usage record
    delete: async (id) => {
        const [result] = await db.query("DELETE FROM `usage` WHERE id = ?", [id]);
        return result;
    },
};

module.exports = Usage;
