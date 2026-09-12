import express from "express";
import { register, login } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------- Public routes ----------
router.post("/register", register);
router.post("/login", login);

// ---------- Protected routes ----------
// Returns the logged-in user's info (from req.user set by verifyToken)
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
