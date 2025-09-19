const express = require("express");
const { fetchUsers, fetchUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", fetchUsers);     // GET /api/users
router.get("/:id", fetchUser);   // GET /api/users/:id

module.exports = router;
