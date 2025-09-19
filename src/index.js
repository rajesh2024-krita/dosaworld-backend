import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import activityLogs from "./routes/activityLogs.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import timeSlotRoutes from "./routes/timeSlotRoutes.js";

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
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
export default app;