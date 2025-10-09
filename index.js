const express = require("express");
const cors = require("cors");
require("./src/scheduler/eodReport");


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

const app = express();

app.use(
  cors({
    origin: "*",
    // origin: ["http://localhost:5173", "http://localhost:8080"],
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
app.use("/api/billings", billingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/usage", usageRoutes);
app.use('/api/offer-sections', offerRoutes);
app.use("/api/parties", partyRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
