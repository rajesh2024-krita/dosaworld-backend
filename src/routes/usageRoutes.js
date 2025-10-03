const express = require("express");
const {
  getUsage,
  getUsageById,
  createUsage,
  deleteUsage,
} = require("../controllers/usageController");

const router = express.Router();

// Middleware to sanitize usage input
const sanitizeUsage = (req, res, next) => {
  req.body.inventoryId = Number(req.body.inventoryId) || 0;
  req.body.usedQty = Number(req.body.usedQty) || 0;
  next();
};

// ---------- Usage Routes ----------
// GET all usage
router.get("/", getUsage);

// GET usage by ID
router.get("/:id", getUsageById);

// POST create usage
router.post("/", createUsage);

// DELETE usage by ID
router.delete("/:id", deleteUsage);

module.exports = router;
