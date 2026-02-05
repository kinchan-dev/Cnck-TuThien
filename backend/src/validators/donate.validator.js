import { body } from "express-validator";

export const donateValidator = [
  body("campaignMongoId").notEmpty().withMessage("campaignMongoId required"),
  body("amountVND").isInt({ min: 1 }).withMessage("amountVND must be >= 1"),
  body("paymentTxHash").optional().isString(),
];
