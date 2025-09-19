const { getMenuData } = require("../models/menuModel");

const fetchMenu = async (req, res) => {
  try {
    const rows = await getMenuData();

    // Group by category_id
    const grouped = {};
    rows.forEach((row) => {
      if (!grouped[row.category_id]) {
        grouped[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          description: row.category_description,
          image: row.category_image,
          items: [],
        };
      }
      grouped[row.category_id].items.push({
        id: row.id,
        code: row.code,
        name: row.item_name,
        description: row.item_description,
        price: row.price,
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("Error in fetchMenu:", err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};

module.exports = { fetchMenu };
