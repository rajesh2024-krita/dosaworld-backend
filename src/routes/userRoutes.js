import express from "express";
import { fetchUsers, fetchUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", fetchUsers);     // GET /api/users
router.get("/:id", fetchUser);   // GET /api/users/:id

export default router;
