import bcrypt from "bcrypt";
import {
  userFindByEmail,
  userInsertData,
  userUpdateLastLogin,
} from "../models/userModel.js";

// ----------------------------------------------------------------
// POST /api/register
// Body: { email, password, role? }
// ----------------------------------------------------------------
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Basic validation
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

    // 2. Check if email already exists
    const existing = await userFindByEmail(email);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 3. Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Insert the new user
    const result = await userInsertData({
      email,
      password_hash,
      role: role === "admin" ? "admin" : "student", // prevent accidental admin creation
    });

    // 5. Respond
    return res.status(201).json({
      message: "Registration successful",
      student_id: result.insertId,
      email,
    });
  } catch (err) {
    // Handle the UNIQUE constraint error just in case
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------------------------------
// POST /api/login
// Body: { email, password }
// ----------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 1. Find the user
    const rows = await userFindByEmail(email);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = rows[0];

    // 2. Compare passwords
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Update last_login
    await userUpdateLastLogin(user.student_id);

    // 4. Respond (never send password_hash back!)
    return res.json({
      message: "Login successful",
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
