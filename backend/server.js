import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars FIRST so every other import sees them
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Global middleware ----------
app.use(
  cors({
    origin: "http://localhost:5173", // your Vite dev server
    credentials: true,
  }),
);
app.use(express.json());

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// ---------- Routes ----------
app.use("/api", userRoutes); // /api/register, /api/login, /api/me
app.use("/api/admin", adminRoutes); // /api/admin/login, /api/admin/create

// ---------- 404 + error handling (must be LAST) ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
