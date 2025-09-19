const Reservation = require("../models/reservationModel");

const reservationController = {
  async list(req, res) {
    try {
      const filters = {
        party_size: req.query.party_size || '',
        date: req.query.date || '',
        time: req.query.time || ''
      };
      const rows = await Reservation.getAll(filters);
      res.json(rows);
    } catch (err) {
      console.error('Error listing reservations', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async get(req, res) {
    try {
      const id = Number(req.params.id);
      const row = await Reservation.getById(id);
      if (!row) return res.status(404).json({ message: 'Not found' });
      res.json(row);
    } catch (err) {
      console.error('Error getting reservation', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async create(req, res) {
    try {
      const payload = req.body;
      if (!payload.name || !payload.date || !payload.time || !payload.party_size) {
        return res.status(400).json({ message: 'name, party_size, date and time are required' });
      }
      const created = await Reservation.create(payload);
      res.status(201).json(created);
    } catch (err) {
      console.error('Error creating reservation', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const payload = req.body;
      const existing = await Reservation.getById(id);
      if (!existing) return res.status(404).json({ message: 'Not found' });
      const updated = await Reservation.update(id, payload);
      res.json(updated);
    } catch (err) {
      console.error('Error updating reservation', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async remove(req, res) {
    try {
      const id = Number(req.params.id);
      const existing = await Reservation.getById(id);
      if (!existing) return res.status(404).json({ message: 'Not found' });
      const ok = await Reservation.delete(id);
      res.json({ success: ok });
    } catch (err) {
      console.error('Error deleting reservation', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = reservationController;
