import express from "express";
import cors from "cors";
import morgan from "morgan";

import campaignRoutes from "./routes/campaign.routes.js";
import donateRoutes from "./routes/donate.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api", authRoutes);
  app.use("/api", adminRoutes);

  app.use("/api", campaignRoutes);
  app.use("/api", donateRoutes);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ ok: false, message: "Internal server error" });
  });

  return app;
}
