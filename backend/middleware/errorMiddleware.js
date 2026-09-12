/**
 * notFound — handles any request that didn't match a route.
 * Must be placed AFTER all routes.
 */
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

/**
 * errorHandler — central place to log errors and send a clean response.
 * Express recognizes this as an error handler because it has 4 arguments.
 */
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  // MySQL duplicate-key error
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Duplicate entry" });
  }

  // JWT errors (in case they slip past authMiddleware)
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({ message: "Invalid token" });
  }

  // Default
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
  });
};
