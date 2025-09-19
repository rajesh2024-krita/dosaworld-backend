const TimeSlot = require("../models/TimeSlot");

const getAllTimeSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.getAll();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.create(req.body);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.update(req.params.id, req.body);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTimeSlot = async (req, res) => {
  try {
    const result = await TimeSlot.delete(req.params.id);
    res.json({ success: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
};
