import { Router } from "express";
import { donateValidator } from "../validators/donate.validator.js";
import { donate, listDonationsByCampaign } from "../controllers/donate.controller.js";

const router = Router();

router.post("/donate", donateValidator, donate);
router.get("/donations/:campaignMongoId", listDonationsByCampaign);

export default router;
