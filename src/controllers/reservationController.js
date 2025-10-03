const Reservation = require("../models/reservationModel");
const sendMail = require("../util/mail"); // ✅ Import sendMail function

const reservationController = {
  // List reservations
  async list(req, res) {
    try {
      const filters = {
        party_size: req.query.party_size || "",
        date: req.query.date || "",
        time: req.query.time || "",
      };
      const rows = await Reservation.getAll(filters);
      res.json(rows);
    } catch (err) {
      console.error("Error listing reservations", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Get a reservation
  async get(req, res) {
    try {
      const id = Number(req.params.id);
      const row = await Reservation.getById(id);
      if (!row) return res.status(404).json({ message: "Not found" });
      res.json(row);
    } catch (err) {
      console.error("Error getting reservation", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Create a reservation
  async create(req, res) {
    try {
      const payload = req.body;
      if (
        !payload.first_name ||
        !payload.last_name ||
        !payload.phone ||
        !payload.email ||
        !payload.date ||
        !payload.time ||
        !payload.party_size
      ) {
        return res.status(400).json({
          message:
            "first_name, last_name, phone, email, party_size, date and time are required",
        });
      }

      const created = await Reservation.create(payload);

      // 1️⃣ Send email to admin about new reservation
      const adminEmail = "rajesh.kritatechnosolutions@gmail.com"; // replace with your admin email
      await sendMail({
        to: adminEmail,
        subject: "New Reservation Booked",
        html: `
        <h2>New Reservation</h2>
        <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <p><strong>Date:</strong> ${payload.date}</p>
        <p><strong>Time:</strong> ${payload.time}</p>
        <p><strong>Party Size:</strong> ${payload.party_size}</p>
      `,
        replyTo: payload.email, // allows admin to reply to customer directly
      });

      // 2️⃣ Send confirmation email to customer
      await sendMail({
        to: payload.email,
        subject: "Your Reservation is Confirmed",
        html: `
        <h2>Reservation Confirmed</h2>
        <p>Dear ${payload.first_name} ${payload.last_name},</p>
        <p>Your reservation has been successfully booked.</p>
        <p><strong>Date:</strong> ${payload.date}</p>
        <p><strong>Time:</strong> ${payload.time}</p>
        <p><strong>Party Size:</strong> ${payload.party_size}</p>
        <br>
        <p>Thank you,<br>Your Restaurant Team</p>
      `,
        replyTo: adminEmail, // replies go back to admin
      });

      res.status(201).json(created);
    } catch (err) {
      console.error("Error creating reservation", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // Update reservation
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const payload = req.body;
      const existing = await Reservation.getById(id);
      if (!existing) return res.status(404).json({ message: "Not found" });
      const updated = await Reservation.update(id, payload);
      res.json(updated);
    } catch (err) {
      console.error("Error updating reservation", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete reservation
  async remove(req, res) {
    try {
      const id = Number(req.params.id);
      const existing = await Reservation.getById(id);
      if (!existing) return res.status(404).json({ message: "Not found" });
      const ok = await Reservation.delete(id);
      res.json({ success: ok });
    } catch (err) {
      console.error("Error deleting reservation", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = reservationController;
