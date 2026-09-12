import jwt from "jsonwebtoken";

/**
 * verifyToken — checks that the request carries a valid JWT.
 * On success: attaches `req.user = { id, email, role }` and calls next().
 * On failure: responds 401 (missing/malformed) or 403 (invalid/expired).
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Header must exist and start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // 2. Extract the token after "Bearer "
  const token = authHeader.split(" ")[1];

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    console.error("Token verification error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * optionalAuth — same as verifyToken, but doesn't fail if no token.
 * Useful for routes that behave differently for logged-in vs guest users.
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null; // ignore invalid tokens here
  }
  next();
};
