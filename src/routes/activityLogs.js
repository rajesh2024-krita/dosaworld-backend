const express = require("express");
const { getLogs, addLog, exportLogs } = require("../controllers/ActivityLogController");

const router = express.Router();

// Get all logs
router.get("/", getLogs);

// Add a new log
router.post("/", addLog);

// Export logs
router.get("/export", exportLogs);

module.exports = router;
