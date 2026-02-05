import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-passwordHash");
    if (!user) return res.status(401).json({ ok: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: "Invalid/expired token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ ok: false, message: "Forbidden" });
    next();
  };
}

export function requireVerifiedOrg(req, res, next) {
  // admin vẫn được làm mọi thứ
  if (req.user?.role === "admin") return next();
  if (req.user?.accountType !== "organization") {
    return res.status(403).json({ ok: false, message: "Only organization account can create campaigns" });
  }
  if (!req.user?.orgVerified) {
    return res.status(403).json({ ok: false, message: "Organization not verified by admin" });
  }
  next();
}
