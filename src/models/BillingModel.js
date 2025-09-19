// src/models/BillingModel.js
const pool = require("../config/db");

const getAllBillings = async () => {
  const [rows] = await pool.query("SELECT * FROM billings ORDER BY date DESC");
  return rows;
};

const insertBilling = async (data) => {
  const { date, card, cash, handledBy, trinkgeld, trinkgeldBar, paid } = data;

  const [result] = await pool.query(
    `INSERT INTO billings 
    (date, card, cash, handledBy, trinkgeld, trinkgeldBar, paid) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [date, card, cash, handledBy, trinkgeld, trinkgeldBar, paid]
  );

  return { id: result.insertId, ...data };
};

const getFilteredBillings = async (from, to) => {
  let sql = "SELECT * FROM billings WHERE 1=1";
  const params = [];

  if (from) {
    sql += " AND date >= ?";
    params.push(from);
  }
  if (to) {
    sql += " AND date <= ?";
    params.push(to);
  }

  sql += " ORDER BY date DESC";

  const [rows] = await pool.query(sql, params);
  return rows;
};

module.exports = {
  getAllBillings,
  insertBilling,
  getFilteredBillings,
};
