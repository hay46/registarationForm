import mysql from "mysql2/promise";    
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({            
  host: process.env.MYSQL_HOST ,
  user: process.env.MYSQL_USER ,
  password: process.env.MYSQL_PASSWORD ,
  database: process.env.MYSQL_DATABASE ,
  waitForConnections: true,               // ✅ Pool options
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log(" Database connected successfully");
    conn.release();
  } catch (err) {
    console.error(" Database connection failed:", err.message);
    process.exit(1);
  }
})();

export default db;                        // ✅ Make it importable

// CREATE TABLE IF NOT EXISTS users (
//     student_id      INT AUTO_INCREMENT PRIMARY KEY,
//     email         VARCHAR(100) NOT NULL UNIQUE,
//     password_hash VARCHAR(255) NOT NULL,
//     role          ENUM('student', 'admin') DEFAULT 'student',
//     last_login    TIMESTAMP NULL,
//     created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     INDEX idx_users_email (email)
// );

