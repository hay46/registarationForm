import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  userFindByEmail,
  userInsertData,
  userUpdateLastLogin,
} from "../models/userModel.js";

// ---------------- LOGIN ADMIN ----------------
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const rows = await userFindByEmail(email);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await userUpdateLastLogin(user.student_id);

    const token = jwt.sign(
      { id: user.student_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        student_id: user.student_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err); // delegate to errorHandler
  }
};

// ---------------- CREATE ADMIN ----------------
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existing = await userFindByEmail(email);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await userInsertData({
      email,
      password_hash,
      role: "admin",
    });

    return res.status(201).json({
      message: "Admin created successfully",
      student_id: result.insertId,
      email,
    });
  } catch (err) {
    next(err);
  }
};
