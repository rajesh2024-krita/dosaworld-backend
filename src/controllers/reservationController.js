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
  // async create(req, res) {
  //   // try {
  //   //   const payload = req.body;
  //   //   if (
  //   //     !payload.first_name ||
  //   //     !payload.last_name ||
  //   //     !payload.phone ||
  //   //     !payload.email ||
  //   //     !payload.date ||
  //   //     !payload.time ||
  //   //     !payload.party_size
  //   //   ) {
  //   //     return res.status(400).json({
  //   //       message:
  //   //         "first_name, last_name, phone, email, party_size, date and time are required",
  //   //     });
  //   //   }

  //   //   const created = await Reservation.create(payload);

  //   //   // 1️⃣ Send email to admin about new reservation
  //   //   const adminEmail = "rajesh.kritatechnosolutions@gmail.com"; // replace with your admin email
  //   //   await sendMail({
  //   //     to: adminEmail,
  //   //     subject: "New Reservation Booked",
  //   //     html: `
  //   //     <h2>New Reservation</h2>
  //   //     <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
  //   //     <p><strong>Email:</strong> ${payload.email}</p>
  //   //     <p><strong>Phone:</strong> ${payload.phone}</p>
  //   //     <p><strong>Date:</strong> ${payload.date}</p>
  //   //     <p><strong>Time:</strong> ${payload.time}</p>
  //   //     <p><strong>Party Size:</strong> ${payload.party_size}</p>
  //   //   `,
  //   //     replyTo: payload.email, // allows admin to reply to customer directly
  //   //   });

  //   //   // 2️⃣ Send confirmation email to customer
  //   //   await sendMail({
  //   //     to: payload.email,
  //   //     subject: "Your Reservation is Confirmed",
  //   //     html: `
  //   //     <h2>Reservation Confirmed</h2>
  //   //     <p>Dear ${payload.first_name} ${payload.last_name},</p>
  //   //     <p>Your reservation has been successfully booked.</p>
  //   //     <p><strong>Date:</strong> ${payload.date}</p>
  //   //     <p><strong>Time:</strong> ${payload.time}</p>
  //   //     <p><strong>Party Size:</strong> ${payload.party_size}</p>
  //   //     <br>
  //   //     <p>Thank you,<br>Your Restaurant Team</p>
  //   //   `,
  //   //     replyTo: adminEmail, // replies go back to admin
  //   //   });

  //   //   res.status(201).json(created);
  //   // }
  //   try {
  //     const payload = req.body;

  //     // Validate required fields
  //     if (
  //       !payload.first_name ||
  //       !payload.last_name ||
  //       !payload.phone ||
  //       !payload.email ||
  //       !payload.date ||
  //       !payload.time ||
  //       !payload.party_size
  //     ) {
  //       return res.status(400).json({
  //         message:
  //           "first_name, last_name, phone, email, party_size, date and time are required",
  //       });
  //     }
  //     console.log("all field available");
      
  //     const created = await Reservation.create(payload);

  //     const adminEmail = "rajesh.kritatechnosolutions@gmail.com";
  //     const isGermanNumber = payload.phone.startsWith("+49");
  //     console.log("germany number", isGermanNumber);
      

  //     // ------------- ✉️ Email Templates -------------
  //     const subjects = {
  //       en: {
  //         admin: "New Table Reservation - Dosa World Restaurant",
  //         customer: "Your Table Reservation at Dosa World Restaurant is Confirmed",
  //       },
  //       de: {
  //         admin: "Neue Tischreservierung - Dosa World Restaurant",
  //         customer: "Ihre Tischreservierung im Dosa World Restaurant ist bestätigt",
  //       },
  //     };

  //     const adminBodies = {
  //       en: `
  //         <h2>New Reservation Received</h2>
  //         <p>A new table reservation has been made at <strong>Dosa World Restaurant</strong>.</p>
  //         <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
  //         <p><strong>Email:</strong> ${payload.email}</p>
  //         <p><strong>Phone:</strong> ${payload.phone}</p>
  //         <p><strong>Date:</strong> ${payload.date}</p>
  //         <p><strong>Time:</strong> ${payload.time}</p>
  //         <p><strong>Party Size:</strong> ${payload.party_size}</p>
  //         <br>
  //         <p>Kind regards,<br><strong>Dosa World Reservation System</strong></p>
  //       `,
  //       de: `
  //         <h2>Neue Reservierung erhalten</h2>
  //         <p>Eine neue Tischreservierung wurde im <strong>Dosa World Restaurant</strong> vorgenommen.</p>
  //         <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
  //         <p><strong>E-Mail:</strong> ${payload.email}</p>
  //         <p><strong>Telefon:</strong> ${payload.phone}</p>
  //         <p><strong>Datum:</strong> ${payload.date}</p>
  //         <p><strong>Uhrzeit:</strong> ${payload.time}</p>
  //         <p><strong>Personenzahl:</strong> ${payload.party_size}</p>
  //         <br>
  //         <p>Mit freundlichen Grüßen,<br><strong>Dosa World Reservierungssystem</strong></p>
  //       `,
  //     };

  //     const customerBodies = {
  //       en: `
  //         <h2>Reservation Confirmation</h2>
  //         <p>Dear ${payload.first_name} ${payload.last_name},</p>
  //         <p>We are delighted to confirm your table reservation at <strong>Dosa World Restaurant</strong>.</p>
  //         <p><strong>Date:</strong> ${payload.date}</p>
  //         <p><strong>Time:</strong> ${payload.time}</p>
  //         <p><strong>Party Size:</strong> ${payload.party_size}</p>
  //         <p>Please arrive 10 minutes prior to your reservation time. We look forward to welcoming you!</p>
  //         <br>
  //         <p>Warm regards,<br><strong>Dosa World Restaurant Team</strong></p>
  //       `,
  //       de: `
  //         <h2>Reservierungsbestätigung</h2>
  //         <p>Sehr geehrte/r ${payload.first_name} ${payload.last_name},</p>
  //         <p>Wir freuen uns, Ihre Tischreservierung im <strong>Dosa World Restaurant</strong> bestätigen zu können.</p>
  //         <p><strong>Datum:</strong> ${payload.date}</p>
  //         <p><strong>Uhrzeit:</strong> ${payload.time}</p>
  //         <p><strong>Personenzahl:</strong> ${payload.party_size}</p>
  //         <p>Bitte kommen Sie etwa 10 Minuten vor der reservierten Zeit. Wir freuen uns auf Ihren Besuch!</p>
  //         <br>
  //         <p>Mit freundlichen Grüßen,<br><strong>Dosa World Restaurant Team</strong></p>
  //       `,
  //     };

  //     const lang = isGermanNumber ? "de" : "en";

  //     // 1️⃣ Send email to admin
  //     await sendMail({
  //       to: adminEmail,
  //       subject: subjects[lang].admin,
  //       html: adminBodies[lang],
  //       replyTo: payload.email,
  //     });

  //     // 2️⃣ Send confirmation email to customer
  //     await sendMail({
  //       to: payload.email,
  //       subject: subjects[lang].customer,
  //       html: customerBodies[lang],
  //       replyTo: adminEmail,
  //     });

  //     // Response
  //     res.status(201).json({
  //       message: `Reservation created successfully and confirmation email sent in ${lang === "de" ? "German" : "English"}.`,
  //       data: created,
  //     });

  //   } 
  //    catch (err) {
  //     console.error("Error creating reservation", err);
  //     res.status(500).json({ message: "Server error", error: err.message });
  //   }
  // },

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
          <h2>Reservation Confirmation</h2>
          <p>Dear ${payload.first_name} ${payload.last_name},</p>
          <p>We are delighted to confirm your table reservation at <strong>Dosa World Restaurant</strong>.</p>
          <p><strong>Date:</strong> ${payload.date}</p>
          <p><strong>Time:</strong> ${payload.time}</p>
          <p><strong>Party Size:</strong> ${payload.party_size}</p>
          <p>Please arrive 10 minutes prior to your reservation time. We look forward to welcoming you!</p>
          <br>
          <p>Warm regards,<br><strong>Dosa World Restaurant Team</strong></p>
        `,
        de: `
          <h2>Reservierungsbestätigung</h2>
          <p>Sehr geehrte/r ${payload.first_name} ${payload.last_name},</p>
          <p>Wir freuen uns, Ihre Tischreservierung im <strong>Dosa World Restaurant</strong> bestätigen zu können.</p>
          <p><strong>Datum:</strong> ${payload.date}</p>
          <p><strong>Uhrzeit:</strong> ${payload.time}</p>
          <p><strong>Personenzahl:</strong> ${payload.party_size}</p>
          <p>Bitte kommen Sie etwa 10 Minuten vor der reservierten Zeit. Wir freuen uns auf Ihren Besuch!</p>
          <br>
          <p>Mit freundlichen Grüßen,<br><strong>Dosa World Restaurant Team</strong></p>
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
