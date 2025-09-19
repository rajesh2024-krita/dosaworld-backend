const express = require("express");
const ItemController = require("../controllers/itemController");

const router = express.Router();

router.get("/", ItemController.getItems);
router.get("/:id", ItemController.getItem);
router.post("/", ItemController.createItem);
router.put("/:id", ItemController.updateItem);
router.delete("/:id", ItemController.deleteItem);

module.exports = router;
