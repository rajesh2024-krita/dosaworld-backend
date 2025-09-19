const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const activityLogs = require("./src/routes/activityLogs");
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const itemRoutes = require("./src/routes/itemRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const timeSlotRoutes = require("./src/routes/timeSlotRoutes");

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
