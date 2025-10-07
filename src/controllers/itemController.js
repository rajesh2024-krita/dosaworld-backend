const Item = require("../models/itemModel");
const pool = require("../config/db");

const getItems = async (req, res) => {
  try {
    const items = await Item.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getItem = async (req, res) => {
  try {
    const item = await Item.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, price, category_id, description, code } = req.body;
    console.log('req.body == ', req.body)

    if (!category_id) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const newItem = await Item.createItem({ name, price, category_id, description, code });
    res.status(200).json(newItem);
  } catch (err) {
    console.error("Create Item Error:", err);
    res.status(500).json({ error: `error - ${err.message}` });
  }
};

const updateItem = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Check if category exists
    const [categoryRows] = await pool.query(
      "SELECT id FROM categories WHERE id = ?",
      [categoryId]
    );

    if (categoryRows.length === 0) {
      return res.status(400).json({ error: "Invalid categoryId" });
    }

    const updated = await Item.updateItem(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(500).json({ error: err.message });
  }
};


const deleteItem = async (req, res) => {
  try {
    await Item.deleteItem(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
};
