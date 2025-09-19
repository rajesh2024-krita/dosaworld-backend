const pool = require("../config/db");

const getMenuData = async () => {
  const [rows] = await pool.query(`
    SELECT 
      i.id, 
      i.code, 
      i.name AS item_name, 
      i.description AS item_description, 
      i.price, 
      i.category_id, 
      c.name AS category_name, 
      c.description AS category_description, 
      c.image AS category_image
    FROM items i
    JOIN categories c ON i.category_id = c.id
    ORDER BY c.id, i.id;
  `);
  return rows;
};

module.exports = { getMenuData };
