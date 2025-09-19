// src/routes/billingRoutes.js
const express = require("express");
const { getBillings, createBilling } = require("../controllers/BillingController");

const router = express.Router();

router.get("/", getBillings);   // GET all or filtered
router.post("/", createBilling); // Insert new entry

module.exports = router;
