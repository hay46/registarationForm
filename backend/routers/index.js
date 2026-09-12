import express from "express";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

router.use("/", userRoutes); // /api/register, /api/login, /api/me
router.use("/admin", adminRoutes); // /api/admin/login, /api/admin/create

export default router;
