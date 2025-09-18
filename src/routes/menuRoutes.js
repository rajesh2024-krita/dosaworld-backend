import express from "express";
import { fetchMenu } from "../controllers/menuController.js";

const router = express.Router();

router.get("/", fetchMenu);

export default router;
