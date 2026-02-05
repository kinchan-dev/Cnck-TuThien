import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(user) {
  const token = jwt.sign(
    { role: user.role, accountType: user.accountType },
    process.env.JWT_SECRET,
    { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
  return token;
}

export async function register(req, res) {
  try {
    const { email, password, name = "", accountType = "individual", orgDocUrl = "" } = req.body;

    if (!email || !password) return res.status(400).json({ ok: false, message: "Email & password required" });
    if (password.length < 6) return res.status(400).json({ ok: false, message: "Password must be >= 6 chars" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ ok: false, message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      accountType: accountType === "organization" ? "organization" : "individual",
      orgDocUrl: accountType === "organization" ? orgDocUrl : "",
      orgVerified: false,
      role: "user",
    });

    const token = signToken(user);

    return res.json({
      ok: true,
      data: { user: { id: user._id, email: user.email, role: user.role, accountType: user.accountType, orgVerified: user.orgVerified, name: user.name }, token }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, message: "Email & password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const token = signToken(user);

    return res.json({
      ok: true,
      data: { user: { id: user._id, email: user.email, role: user.role, accountType: user.accountType, orgVerified: user.orgVerified, name: user.name }, token }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message || "Server error" });
  }
}

export async function me(req, res) {
  return res.json({ ok: true, data: req.user });
}
