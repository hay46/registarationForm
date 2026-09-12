import db from "../config/db.js";

/**
 * Find a user by email.
 * Returns an array of rows (empty array if no match).
 */
export const userFindByEmail = async (email) => {
  const sql =
    "SELECT student_id, email, password_hash, role, last_login, created_at FROM users WHERE email = ?";
  const [rows] = await db.query(sql, [email]);
  return rows;
};

/**
 * Insert a new user. Returns the insert result (contains insertId).
 * NOTE: password_hash must already be hashed by the caller.
 */
export const userInsertData = async ({
  email,
  password_hash,
  role = "student",
}) => {
  const sql = "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [email, password_hash, role]);
  return result;
};

/**
 * Update the last_login timestamp to now.
 */
export const userUpdateLastLogin = async (student_id) => {
  const sql =
    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE student_id = ?";
  const [result] = await db.query(sql, [student_id]);
  return result;
};
