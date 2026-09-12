import express from "express";
import { loginAdmin, createAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/create", verifyToken, requireAdmin, createAdmin);

export default router;
