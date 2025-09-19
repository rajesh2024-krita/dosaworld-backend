// src/controllers/BillingController.js
const {
  getAllBillings,
  insertBilling,
  getFilteredBillings,
} = require("../models/BillingModel");

const getBillings = async (req, res) => {
  try {
    const { from, to } = req.query;
    let data = [];

    if (from || to) {
      data = await getFilteredBillings(from, to);
    } else {
      data = await getAllBillings();
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createBilling = async (req, res) => {
  try {
    const newBilling = await insertBilling(req.body);
    res.status(201).json({ success: true, data: newBilling });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getBillings,
  createBilling,
};
