import pool from "../config/db.js";

export async function getAllCategories() {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
  return rows;
}

export async function getCategoryById(id) {
  const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0];
}

export async function createCategory(data) {
  const { name, description, image } = data;
  const [result] = await pool.query(
    "INSERT INTO categories (name, description, image) VALUES (?, ?, ?)",
    [name, description, image]
  );
  return { id: result.insertId, ...data };
}

export async function updateCategory(id, data) {
  const { name, description, image } = data;
  await pool.query(
    "UPDATE categories SET name = ?, description = ?, image = ? WHERE id = ?",
    [name, description, image, id]
  );
  return { id, ...data };
}

export async function deleteCategory(id) {
  await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  return true;
}
