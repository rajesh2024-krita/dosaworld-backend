const pool = require("../config/db");

const getAllCategories = async () => {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0];
};

const createCategory = async (data) => {
  const { name, description, image } = data;
  const [result] = await pool.query(
    "INSERT INTO categories (name, description, image) VALUES (?, ?, ?)",
    [name, description, image]
  );
  return { id: result.insertId, ...data };
};

const updateCategory = async (id, data) => {
  const { name, description, image } = data;
  console.log('name, description, image', name, description, image)
  await pool.query(
    "UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?",
    [name, description, image, id]
  );
  return { id, ...data };
};

const deleteCategory = async (id) => {
  await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  return true;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
