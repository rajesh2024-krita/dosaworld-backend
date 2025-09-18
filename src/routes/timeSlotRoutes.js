import express from "express"
import {
  getAllTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
} from "../controllers/timeSlotController.js"

const router = express.Router()

router.get("/", getAllTimeSlots)
router.post("/", createTimeSlot)
router.put("/:id", updateTimeSlot)
router.delete("/:id", deleteTimeSlot)

export default router
