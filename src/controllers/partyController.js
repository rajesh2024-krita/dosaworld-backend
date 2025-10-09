const parties = require("../models/partyModel");

// Get all parties
const getAllParties = (req, res) => {
  try {
    res.json({
      success: true,
      data: parties,
      count: parties.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parties',
      error: error.message
    });
  }
};

// Get party by ID
const getPartyById = (req, res) => {
  try {
    const { id } = req.params;
    const party = parties.find(p => p.id === parseInt(id));
    if (!party) {
      return res.status(404).json({ 
        success: false,
        message: "Party not found" 
      });
    }
    res.json({
      success: true,
      data: party
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching party',
      error: error.message
    });
  }
};

// Add new party
const addParty = (req, res) => {
  try {
    const {
      partyName,
      customerName,
      phone,
      email,
      issuedDate,
      dueDate,
      guests,
      status,
      products,
      address
    } = req.body;

    // Validation
    if (!partyName || !customerName || !phone || !dueDate || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: partyName, customerName, phone, dueDate, address'
      });
    }

    const newParty = {
      ...req.body,
      id: Date.now(),
      issuedDate: issuedDate || new Date().toISOString().split('T')[0],
      status: status || 'registered',
      products: products || [{ name: '', quantity: 0, price: 0 }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    parties.push(newParty);
    
    res.status(201).json({
      success: true,
      message: 'Party created successfully',
      data: newParty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating party',
      error: error.message
    });
  }
};

// Update party
const updateParty = (req, res) => {
  try {
    const { id } = req.params;
    const index = parties.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ 
        success: false,
        message: "Party not found" 
      });
    }

    const {
      partyName,
      customerName,
      phone,
      email,
      issuedDate,
      dueDate,
      guests,
      status,
      products,
      address
    } = req.body;

    // Validation
    if (!partyName || !customerName || !phone || !dueDate || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    parties[index] = { 
      ...parties[index], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Party updated successfully',
      data: parties[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating party',
      error: error.message
    });
  }
};

// Update party status
const updatePartyStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const index = parties.findIndex(p => p.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['registered', 'advance paid', 'paid', 'unpaid', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    parties[index].status = status;
    parties[index].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Party status updated successfully',
      data: parties[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating party status',
      error: error.message
    });
  }
};

// Delete party
const deleteParty = (req, res) => {
  try {
    const { id } = req.params;
    const index = parties.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ 
        success: false,
        message: "Party not found" 
      });
    }

    const deleted = parties.splice(index, 1);
    res.json({
      success: true,
      message: "Party deleted successfully",
      data: deleted[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting party',
      error: error.message
    });
  }
};

// Get overdue parties
const getOverdueParties = (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const overdueParties = parties.filter(
      (p) => p.dueDate && p.dueDate < today && p.status !== 'completed'
    );

    res.json({
      success: true,
      data: overdueParties,
      count: overdueParties.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue parties',
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