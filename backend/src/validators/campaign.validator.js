import { body } from "express-validator";

export const createCampaignValidator = [
  body("name").isString().trim().isLength({ min: 3 }).withMessage("name min 3 chars"),
  body("description").optional().isString(),
  body("targetAmount").isInt({ min: 1 }).withMessage("targetAmount must be >= 1")
];
