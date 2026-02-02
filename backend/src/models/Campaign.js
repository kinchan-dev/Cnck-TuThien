 import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    targetAmount: { type: Number, required: true, min: 1 }, // VND
    totalRaised: { type: Number, default: 0, min: 0 },      // VND (off-chain total)
    category: { type: String, default: "other", index: true },
    // store on-chain campaignId for mapping
    blockchainCampaignId: { type: Number, required: true, unique: true }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model("Campaign", CampaignSchema);
