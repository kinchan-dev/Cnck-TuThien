import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;

async function main() {
  if (!DB_URL) throw new Error("Missing DB_URL in .env");
  await connectDB(DB_URL);

  const app = createApp();
  app.listen(PORT, () => console.log(`✅ Backend running http://localhost:${PORT}`));
}

main().catch((e) => {
  console.error("❌ Server failed:", e);
  process.exit(1);
});
