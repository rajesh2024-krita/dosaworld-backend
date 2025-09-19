const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const activityLogs = require("./routes/activityLogs");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const itemRoutes = require("./routes/itemRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const menuRoutes = require("./routes/menuRoutes");
const timeSlotRoutes = require("./routes/timeSlotRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:8080"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/logs", activityLogs);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/timeslots", timeSlotRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
