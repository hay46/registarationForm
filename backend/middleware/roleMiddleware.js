/**
 * requireRole — allows only users with one of the given roles.
 * Must be used AFTER verifyToken.
 * Usage: router.get("/admin", verifyToken, requireRole("admin"), handler)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

// Convenience wrappers
export const requireAdmin = requireRole("admin");
export const requireStudent = requireRole("student");
