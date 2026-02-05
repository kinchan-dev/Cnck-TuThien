import { Router } from "express";
import { listOrganizations, verifyOrganization } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/admin/organizations", requireAuth, requireRole("admin"), listOrganizations);
router.patch("/admin/organizations/:id/verify", requireAuth, requireRole("admin"), verifyOrganization);

export default router;
