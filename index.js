import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import activityLogs from "./src/routes/activityLogs.js";
import userRoutes from "./src/routes/userRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import reservationRoutes from "./src/routes/reservationRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import timeSlotRoutes from "./src/routes/timeSlotRoutes.js";

const app = express();
app.use(cors({ origin: ["http://localhost:5000", "http://localhost:8080"], credentials: true }));
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
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
