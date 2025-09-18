// routes/activityLogs.js
import express from "express";
import { getLogs, addLog, exportLogs } from "../controllers/ActivityLogController.js";

const router = express.Router();

// Get all logs
router.get("/", getLogs);

// Add a new log
router.post("/", addLog);

// Export logs
router.get("/export", exportLogs);

export default router;
