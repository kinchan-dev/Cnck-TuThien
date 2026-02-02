import mongoose from "mongoose";

const DonationTransactionSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    amountVND: { type: Number, required: true, min: 1 },
    blockchainTxHash: { type: String, required: true }, // Ethereum tx hash of recordDonation
    // optional: off-chain payment tx hash/id
    paymentTxHash: { type: String, default: "" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model("DonationTransaction", DonationTransactionSchema);
