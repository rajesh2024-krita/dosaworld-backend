const express = require("express");
const { login, register, me } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/me", me);

module.exports = router;
