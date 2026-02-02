import { body } from "express-validator";

export const donateValidator = [
  body("campaignMongoId").isString().withMessage("campaignMongoId required"),
  body("amountVND").isInt({ min: 1 }).withMessage("amountVND must be >= 1"),
  body("paymentProvider").optional().isIn(["VNPay", "MoMo"]).withMessage("paymentProvider invalid")
];
