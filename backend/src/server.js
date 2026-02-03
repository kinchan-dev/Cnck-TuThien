import dotenv from "dotenv";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
