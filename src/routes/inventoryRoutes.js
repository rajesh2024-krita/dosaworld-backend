const express = require("express");
const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getInventory);
router.get("/:id", getInventoryById);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

module.exports = router;
