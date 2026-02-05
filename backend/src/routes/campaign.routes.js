import { Router } from "express";
import { createCampaignValidator } from "../validators/campaign.validator.js";
import {
  createCampaign,
  listCampaigns,
  getCampaignById,
  listCampaignTransactions,
} from "../controllers/campaign.controller.js";

import { requireAuth, requireVerifiedOrg } from "../middlewares/auth.js";

const router = Router();

// ✅ chỉ org verified (hoặc admin) mới được tạo
router.post("/campaign", requireAuth, requireVerifiedOrg, createCampaignValidator, createCampaign);

router.get("/campaign", listCampaigns);
router.get("/campaign/:id", getCampaignById);
router.get("/campaign/:id/transactions", listCampaignTransactions);

export default router;
