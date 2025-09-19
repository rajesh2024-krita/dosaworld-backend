const pool = require("../config/db");

const getAllItems = async () => {
  const [rows] = await pool.query(`
    SELECT i.*, c.name AS categoryName
    FROM items i
    JOIN categories c ON i.category_id = c.id
    ORDER BY i.id DESC
  `);
  return rows;
};

const getItemById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [id]);
  return rows[0];
};

const createItem = async (data) => {
  const { code, name, description, price, categoryId } = data;
  const [result] = await pool.query(
    "INSERT INTO items (code, name, description, price, category_id) VALUES (?, ?, ?, ?, ?)",
    [code, name, description, price, categoryId]
  );
  return { id: result.insertId, ...data };
};

const updateItem = async (id, data) => {
  const { code, name, description, price, categoryId } = data;
  await pool.query(
    "UPDATE items SET code = ?, name = ?, description = ?, price = ?, category_id = ? WHERE id = ?",
    [code, name, description, price, categoryId, id]
  );
  return { id, ...data };
};

const deleteItem = async (id) => {
  await pool.query("DELETE FROM items WHERE id = ?", [id]);
  return true;
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
