import pool from "../config/db.js";

export async function getAllItems() {
  const [rows] = await pool.query(`
    SELECT i.*, c.name AS categoryName
    FROM items i
    JOIN categories c ON i.category_id = c.id
    ORDER BY i.id DESC
  `);
  return rows;
}

export async function getItemById(id) {
  const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
  return rows[0];
}

export async function createItem(data) {
  const { code, name, description, price, categoryId } = data;
  console.log(code, name, description, price, categoryId)
  const [result] = await pool.query(
    "INSERT INTO items (code, name, description, price, category_id) VALUES (?, ?, ?, ?, ?)",
    [code, name, description, price, categoryId]
  );
  return { id: result.insertId, ...data };
}

export async function updateItem(id, data) {
  const { code, name, description, price, categoryId } = data;
  await pool.query(
    "UPDATE items SET code = ?, name = ?, description = ?, price = ?, category_id = ? WHERE id = ?",
    [code, name, description, price, categoryId, id]
  );
  return { id, ...data };
}

export async function deleteItem(id) {
  await pool.query("DELETE FROM items WHERE id = ?", [id]);
  return true;
}
