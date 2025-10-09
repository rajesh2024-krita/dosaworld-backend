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
    res.json({ success: true, data: slot });
  } catch (err) {
    if (err.message === "Time slot already exists.") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.update(req.params.id, req.body);
    res.json({ success: true, data: slot });
  } catch (err) {
    if (err.message === "Time slot already exists.") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteTimeSlot = async (req, res) => {
  try {
    const result = await TimeSlot.delete(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot
};
