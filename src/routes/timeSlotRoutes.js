const express = require("express");
const {
  getAllTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} = require("../controllers/timeSlotController");

const router = express.Router();

router.get("/", getAllTimeSlots);
router.post("/", createTimeSlot);
router.put("/:id", updateTimeSlot);
router.delete("/:id", deleteTimeSlot);

module.exports = router;
