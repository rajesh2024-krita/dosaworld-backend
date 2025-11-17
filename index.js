const express = require("express");
const cors = require("cors");
require("./src/scheduler/eodReport");
const nodemailer = require("nodemailer");


const authRoutes = require("./src/routes/authRoutes");
const activityLogs = require("./src/routes/activityLogs");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const timeSlotRoutes = require("./src/routes/timeSlotRoutes");
const billingRoutes = require("./src/routes/billingRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const usageRoutes = require("./src/routes/usageRoutes");
const offerRoutes = require("./src/routes/offerSectionRoutes");
const partyRoutes = require("./src/routes/partyRoutes");
const tableRoutes = require("./src/routes/TableRoutes");


const app = express();

app.use(express.json({ limit: '50mb' })); // Increase from default 100kb to 50mb
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(
  cors({
    origin: "*",
    // origin: ["http://localhost:5173", "http://localhost:8080"],
    credentials: true,
  })
);
app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/logs", activityLogs);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/timeslots", timeSlotRoutes);
app.use("/api/billings", billingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/usage", usageRoutes);
app.use('/api/offer-sections', offerRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/tables", tableRoutes);

app.post("/api/contactus", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,                   // or 465 for SSL
      secure: false,               // true for port 465
      auth: {
        user: "dosaworldhamburg@gmail.com",
        pass: "wfcr wweb mwpn edyj",
      },
    });

    // Email content
    const mailOptions = {
      from: `"Website Contact" dosaworldhamburg@gmail.com`,
      to: "dosaworldhamburg@gmail.com", // where you want to receive messages
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
