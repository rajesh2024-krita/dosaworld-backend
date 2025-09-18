import * as TimeSlot from "../models/TimeSlot.js"

export const getAllTimeSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.getAll()
    res.json(slots)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.create(req.body)
    res.json(slot)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.update(req.params.id, req.body)
    res.json(slot)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteTimeSlot = async (req, res) => {
  try {
    const result = await TimeSlot.remove(req.params.id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
