import express from "express";
import { loginAdmin, createAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ---------- Public ----------
// Admin logs in with email/password → gets a JWT with role="admin"
router.post("/login", loginAdmin);

// ---------- Admin-only ----------
// Only an existing admin (with a valid token) can create another admin
router.post("/create", verifyToken, requireAdmin, createAdmin);

export default router;
