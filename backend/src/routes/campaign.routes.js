import { Router } from "express";
import { createCampaignValidator } from "../validators/campaign.validator.js";
import { createCampaign, listCampaigns, getCampaignById } from "../controllers/campaign.controller.js";

const router = Router();

router.post("/campaign", createCampaignValidator, createCampaign);
router.get("/campaign", listCampaigns);
router.get("/campaign/:id", getCampaignById);

export default router;
