import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  userFindByEmail,
  userInsertData,
  userUpdateLastLogin,
} from "../models/userModel.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.student_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await userFindByEmail(email);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await userInsertData({
      email,
      password_hash,
      role: role === "admin" ? "admin" : "student",
    });

    return res.status(201).json({
      message: "Registration successful",
      student_id: result.insertId,
      email,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN (returns JWT) ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const rows = await userFindByEmail(email);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await userUpdateLastLogin(user.student_id);
    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        student_id: user.student_id,
        email: user.email,
        role: user.role,
        last_login: user.last_login,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
