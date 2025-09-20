// routes/categoryRoutes.js
const express = require("express");
const CategoryController = require("../controllers/categoryController");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategory);
router.post("/create", upload.single("imageFile"), CategoryController.createCategory);
router.put("/update/:id", upload.single("imageFile"), CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
