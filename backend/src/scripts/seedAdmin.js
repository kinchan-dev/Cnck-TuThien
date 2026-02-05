import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";

// ===== Load .env correctly (seedAdmin.js is in backend/src/scripts) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env is in backend/.env  -> go up 2 levels from src/scripts
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function main() {
  const DB_URL = process.env.DB_URL;
  if (!DB_URL) throw new Error("Missing DB_URL in backend/.env");

  await connectDB(DB_URL);

  const email = (process.env.ADMIN_EMAIL || "admin@chaincharity.local").toLowerCase();
  const pass = process.env.ADMIN_PASSWORD || "Admin@12345";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("✅ Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(pass, 10);

  await User.create({
    email,
    passwordHash,
    role: "admin",
    accountType: "individual",
    name: "Admin",
    orgVerified: true,
  });

  console.log("✅ Seeded admin:", email, "| password:", pass);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ seedAdmin failed:", e);
  process.exit(1);
});
