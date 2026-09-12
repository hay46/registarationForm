import express from "express";
import { register, login } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
