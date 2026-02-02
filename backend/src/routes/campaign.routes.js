import { Router } from "express";
import { createCampaignValidator } from "../validators/campaign.validator.js";
import {
  createCampaign,
  listCampaigns,
  getCampaignById,
  listCampaignTransactions,
} from "../controllers/campaign.controller.js";

const router = Router();

router.post("/campaign", createCampaignValidator, createCampaign);
router.get("/campaign", listCampaigns);
router.get("/campaign/:id", getCampaignById);
router.get("/campaign/:id/transactions", listCampaignTransactions);

export default router;
