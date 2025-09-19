const express = require("express");
const { fetchMenu } = require("../controllers/menuController");

const router = express.Router();

router.get("/", fetchMenu);

module.exports = router;
