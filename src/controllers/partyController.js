const PartyModel = require("../models/partyModel");

// Get all parties
const getAllParties = async (req, res) => {
  try {
    const allParties = await PartyModel.getAll();

    res.status(200).json({
      success: true,
      data: allParties,
      count: allParties.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching parties",
      error: error.message
    });
  }
};

// Get party by ID
const getPartyById = async (req, res) => {
  try {
    const { id } = req.params;
    const party = await PartyModel.getById(id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found"
      });
    }

    res.json({ success: true, data: party });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching party",
      error: error.message
    });
  }
};

// Add new party
const addParty = async (req, res) => {
  try {
    const {
      partyName,
      customerName,
      phone,
      email,
      issuedDate,
      dueDate,
      guests = 0,
      status = "registered",
      products = [],
      address
    } = req.body;

    if (!partyName || !customerName || !phone || !dueDate || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: partyName, customerName, phone, dueDate, address"
      });
    }

    const newParty = await PartyModel.create({
      partyName,
      customerName,
      phone,
      email: email || "",
      issuedDate: issuedDate || new Date().toISOString(),
      dueDate,
      guests,
      status,
      products,
      address
    });

    res.status(201).json({
      success: true,
      message: "Party created successfully",
      data: newParty
    });
  } catch (error) {
    console.error("Error creating party:", req.body, error); // <--- debug payload
    res.status(500).json({
      success: false,
      message: "Error creating party",
      error: error.message
    });
  }
};



// Update existing party
const updateParty = async (req, res) => {
  try {
    const { id } = req.params;
    const party = await PartyModel.getById(id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found"
      });
    }

    const updatedParty = await PartyModel.update(id, req.body);

    res.json({
      success: true,
      message: "Party updated successfully",
      data: updatedParty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating party",
      error: error.message
    });
  }
};

// Update party status
const updatePartyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const validStatuses = [
      "registered",
      "advance paid",
      "paid",
      "unpaid",
      "completed"
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const party = await PartyModel.updateStatus(id, status);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found"
      });
    }

    res.json({
      success: true,
      message: "Party status updated successfully",
      data: party
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating status",
      error: error.message
    });
  }
};

// Delete party
const deleteParty = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await PartyModel.delete(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Party not found"
      });
    }

    res.json({
      success: true,
      message: "Party deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting party",
      error: error.message
    });
  }
};

// Get overdue parties
const getOverdueParties = async (req, res) => {
  try {
    const overdueParties = await PartyModel.getOverdueParties();

    res.json({
      success: true,
      data: overdueParties,
      count: overdueParties.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching overdue parties",
      error: error.message
    });
  }
};

module.exports = {
  getAllParties,
  getPartyById,
  addParty,
  updateParty,
  deleteParty,
  updatePartyStatus,
  getOverdueParties
};
