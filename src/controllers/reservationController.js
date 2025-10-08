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


  async create(req, res) {
    try {
      const payload = req.body;

      // ✅ Validate required fields
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

      console.log("🟢 All required fields available");

      // ✅ Create reservation in DB
      const created = await Reservation.create(payload);

      const adminEmail = "rajesh.kritatechnosolutions@gmail.com";
      const isGermanNumber = payload.phone.startsWith("+49");
      const lang = isGermanNumber ? "de" : "en";

      console.log("🌍 Language selected:", lang);

      // ------------- ✉️ Email Templates -------------
      const subjects = {
        en: {
          admin: "New Table Reservation - Dosa World Restaurant",
          customer:
            "Your Table Reservation at Dosa World Restaurant is Confirmed",
        },
        de: {
          admin: "Neue Tischreservierung - Dosa World Restaurant",
          customer:
            "Ihre Tischreservierung im Dosa World Restaurant ist bestätigt",
        },
      };

      const adminBodies = {
        en: `
          <h2>New Reservation Received</h2>
          <p>A new table reservation has been made at <strong>Dosa World Restaurant</strong>.</p>
          <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Phone:</strong> ${payload.phone}</p>
          <p><strong>Date:</strong> ${payload.date}</p>
          <p><strong>Time:</strong> ${payload.time}</p>
          <p><strong>Party Size:</strong> ${payload.party_size}</p>
          <br>
          <p>Kind regards,<br><strong>Dosa World Reservation System</strong></p>
        `,
        de: `
          <h2>Neue Reservierung erhalten</h2>
          <p>Eine neue Tischreservierung wurde im <strong>Dosa World Restaurant</strong> vorgenommen.</p>
          <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
          <p><strong>E-Mail:</strong> ${payload.email}</p>
          <p><strong>Telefon:</strong> ${payload.phone}</p>
          <p><strong>Datum:</strong> ${payload.date}</p>
          <p><strong>Uhrzeit:</strong> ${payload.time}</p>
          <p><strong>Personenzahl:</strong> ${payload.party_size}</p>
          <br>
          <p>Mit freundlichen Grüßen,<br><strong>Dosa World Reservierungssystem</strong></p>
        `,
      };

      const customerBodies = {
        en: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #10b981;">
              <img src="https://dosaworldadmin.kritatechnosolutions.com/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 100px; margin-bottom: 10px;">
              <h2 style="color: #047857; margin: 0;">You're Invited to Dosa World Restaurant!</h2>
            </div>

            <div style="padding: 20px; font-size: 16px;">
              <p>Dear <strong>${payload.first_name} ${payload.last_name}</strong>,</p>
              <p>Thank you for choosing <strong style="color: #065f46;">Dosa World Restaurant</strong>! Your table reservation has been successfully confirmed.</p>
              <p>We’re excited to host you and make your dining experience truly special.</p>

              <div style="background-color: #ffffff; border: 1px dashed #34d399; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${payload.date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${payload.time}</p>
                <p style="margin: 5px 0;"><strong>Party Size:</strong> ${payload.party_size}</p>
              </div>

              <p>We’re looking forward to welcoming you at your reserved time.  
              If you have any special requests or changes, please feel free to contact us anytime.</p>

              <p style="margin-top: 30px;">Warm regards,<br>
              <strong style="color: #047857;">The Dosa World Restaurant Team</strong></p>
            </div>

            <div style="text-align: center; border-top: 2px solid #10b981; padding-top: 10px; font-size: 13px; color: #374151;">
              <p>📍 Lämmertwiete 2 21073 Hamburg, Germany | 📞 +4917622213135 </p>
              <p>Follow us on <a href="https://instagram.com/dosaworld" style="color: #059669; text-decoration: none;">Instagram</a> & <a href="https://facebook.com/dosaworld" style="color: #059669; text-decoration: none;">Facebook</a></p>
            </div>
          </div>
        `,

        de: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #10b981;">
              <img src="https://dosaworldadmin.kritatechnosolutions.com/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 100px; margin-bottom: 10px;">
              <h2 style="color: #047857; margin: 0;">Ihre Einladung ins Dosa World Restaurant!</h2>
            </div>

            <div style="padding: 20px; font-size: 16px;">
              <p>Sehr geehrte/r <strong>${payload.first_name} ${payload.last_name}</strong>,</p>
              <p>Vielen Dank, dass Sie sich für das <strong style="color: #065f46;">Dosa World Restaurant</strong> entschieden haben. Ihre Tischreservierung wurde erfolgreich bestätigt!</p>
              <p>Wir freuen uns darauf, Sie zu begrüßen und Ihnen ein besonderes kulinarisches Erlebnis zu bieten.</p>

              <div style="background-color: #ffffff; border: 1px dashed #34d399; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Datum:</strong> ${payload.date}</p>
                <p style="margin: 5px 0;"><strong>Uhrzeit:</strong> ${payload.time}</p>
                <p style="margin: 5px 0;"><strong>Personenzahl:</strong> ${payload.party_size}</p>
              </div>

              <p>Wir freuen uns, Sie zur reservierten Zeit willkommen zu heißen.  
              Bei besonderen Wünschen oder Änderungen kontaktieren Sie uns bitte jederzeit.</p>

              <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
              <strong style="color: #047857;">Ihr Dosa World Restaurant Team</strong></p>
            </div>

            <div style="text-align: center; border-top: 2px solid #10b981; padding-top: 10px; font-size: 13px; color: #374151;">
              <p>📍 Lämmertwiete 2 21073 Hamburg, Germany | 📞 +4917622213135 </p>
              <p>Folgen Sie uns auf <a href="https://instagram.com/dosaworld" style="color: #059669; text-decoration: none;">Instagram</a> & <a href="https://facebook.com/dosaworld" style="color: #059669; text-decoration: none;">Facebook</a></p>
            </div>
          </div>
        `,
      };

      // ✅ 1️⃣ Send email to admin
      await sendMail({
        to: adminEmail,
        subject: subjects["en"].admin,
        html: adminBodies["en"],
        text: "New reservation received at Dosa World.",
      });

      console.log("📧 Admin email sent successfully");

      // ✅ 2️⃣ Send confirmation email to customer
      await sendMail({
        to: payload.email,
        subject: subjects[lang].customer,
        html: customerBodies[lang],
        text: "Your table reservation is confirmed.",
      });

      console.log("📧 Customer email sent successfully");

      // ✅ Response
      res.status(201).json({
        message: `Reservation created successfully and confirmation email sent in ${
          lang === "de" ? "German" : "English"
        }.`,
        data: created,
      });
    } catch (err) {
      console.error("❌ Error creating reservation:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // Update reservation with email notifications
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const payload = req.body;

      // ✅ Check if reservation exists
      const existing = await Reservation.getById(id);
      if (!existing) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      // ✅ Update reservation in DB
      const updated = await Reservation.update(id, payload);

      // ✅ Prepare email
      const adminEmail = "rajesh.kritatechnosolutions@gmail.com";
      const isGermanNumber = payload.phone?.startsWith("+49") || existing.phone.startsWith("+49");
      const lang = isGermanNumber ? "de" : "en";

      const subjects = {
        en: {
          admin: "Updated Table Reservation - Dosa World Restaurant",
          customer: "Your Table Reservation at Dosa World Restaurant is Updated",
        },
        de: {
          admin: "Aktualisierte Tischreservierung - Dosa World Restaurant",
          customer: "Ihre Tischreservierung im Dosa World Restaurant wurde aktualisiert",
        },
      };

      const adminBodies = {
        en: `
          <h2>Reservation Updated</h2>
          <p>The following table reservation has been updated at <strong>Dosa World Restaurant</strong>.</p>
          <p><strong>Name:</strong> ${payload.first_name || existing.first_name} ${payload.last_name || existing.last_name}</p>
          <p><strong>Email:</strong> ${payload.email || existing.email}</p>
          <p><strong>Phone:</strong> ${payload.phone || existing.phone}</p>
          <p><strong>Date:</strong> ${payload.date || existing.date}</p>
          <p><strong>Time:</strong> ${payload.time || existing.time}</p>
          <p><strong>Party Size:</strong> ${payload.party_size || existing.party_size}</p>
          <br>
          <p>Kind regards,<br><strong>Dosa World Reservation System</strong></p>
        `,
        de: `
          <h2>Reservierung aktualisiert</h2>
          <p>Die folgende Tischreservierung wurde im <strong>Dosa World Restaurant</strong> aktualisiert.</p>
          <p><strong>Name:</strong> ${payload.first_name || existing.first_name} ${payload.last_name || existing.last_name}</p>
          <p><strong>E-Mail:</strong> ${payload.email || existing.email}</p>
          <p><strong>Telefon:</strong> ${payload.phone || existing.phone}</p>
          <p><strong>Datum:</strong> ${payload.date || existing.date}</p>
          <p><strong>Uhrzeit:</strong> ${payload.time || existing.time}</p>
          <p><strong>Personenzahl:</strong> ${payload.party_size || existing.party_size}</p>
          <br>
          <p>Mit freundlichen Grüßen,<br><strong>Dosa World Reservierungssystem</strong></p>
        `,
      };

      const customerBodies = {
        en: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #10b981;">
              <img src="https://dosaworldadmin.kritatechnosolutions.com/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 100px; margin-bottom: 10px;">
              <h2 style="color: #047857; margin: 0;">Your Reservation is Updated!</h2>
            </div>
            <div style="padding: 20px; font-size: 16px;">
              <p>Dear <strong>${payload.first_name || existing.first_name} ${payload.last_name || existing.last_name}</strong>,</p>
              <p>Your table reservation at <strong style="color: #065f46;">Dosa World Restaurant</strong> has been successfully updated.</p>
              <div style="background-color: #ffffff; border: 1px dashed #34d399; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${payload.date || existing.date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${payload.time || existing.time}</p>
                <p style="margin: 5px 0;"><strong>Party Size:</strong> ${payload.party_size || existing.party_size}</p>
              </div>
              <p>We’re looking forward to welcoming you. If you have any special requests or changes, feel free to contact us anytime.</p>
              <p style="margin-top: 30px;">Warm regards,<br>
              <strong style="color: #047857;">The Dosa World Restaurant Team</strong></p>
            </div>
          </div>
        `,
        de: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1f2937; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #a7f3d0; max-width: 600px; margin: auto;">
            <div style="text-align: center; padding-bottom: 10px; border-bottom: 2px solid #10b981;">
              <img src="https://dosaworldadmin.kritatechnosolutions.com/assets/logo-H7Hfdi3N.png" alt="Dosa World Logo" style="width: 100px; margin-bottom: 10px;">
              <h2 style="color: #047857; margin: 0;">Ihre Reservierung wurde aktualisiert!</h2>
            </div>
            <div style="padding: 20px; font-size: 16px;">
              <p>Sehr geehrte/r <strong>${payload.first_name || existing.first_name} ${payload.last_name || existing.last_name}</strong>,</p>
              <p>Ihre Tischreservierung im <strong style="color: #065f46;">Dosa World Restaurant</strong> wurde erfolgreich aktualisiert.</p>
              <div style="background-color: #ffffff; border: 1px dashed #34d399; padding: 15px; border-radius: 10px; margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>Datum:</strong> ${payload.date || existing.date}</p>
                <p style="margin: 5px 0;"><strong>Uhrzeit:</strong> ${payload.time || existing.time}</p>
                <p style="margin: 5px 0;"><strong>Personenzahl:</strong> ${payload.party_size || existing.party_size}</p>
              </div>
              <p>Wir freuen uns, Sie zur reservierten Zeit willkommen zu heißen. Bei besonderen Wünschen oder Änderungen kontaktieren Sie uns bitte jederzeit.</p>
              <p style="margin-top: 30px;">Mit herzlichen Grüßen,<br>
              <strong style="color: #047857;">Ihr Dosa World Restaurant Team</strong></p>
            </div>
          </div>
        `,
      };

      // ✅ Send email to admin
      await sendMail({
        to: adminEmail,
        subject: subjects[lang].admin,
        html: adminBodies[lang],
        text: "Reservation updated at Dosa World.",
      });

      // ✅ Send email to customer
      await sendMail({
        to: payload.email || existing.email,
        subject: subjects[lang].customer,
        html: customerBodies[lang],
        text: "Your table reservation has been updated.",
      });

      res.json({
        message: `Reservation updated successfully and confirmation email sent in ${
          lang === "de" ? "German" : "English"
        }.`,
        data: updated,
      });
    } catch (err) {
      console.error("❌ Error updating reservation:", err);
      res.status(500).json({ message: "Server error", error: err.message });
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
