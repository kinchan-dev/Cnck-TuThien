import { validationResult } from "express-validator";
import Campaign from "../models/Campaign.js";
import DonationTransaction from "../models/DonationTransaction.js";
import { getEthContract } from "../config/eth.js";

/**
 * Mock payment gateway (VNPay/MoMo)
 * - In real life: call provider API + verify callback signature
 */
function mockPayment(amountVND, paymentProvider = "VNPay") {
  const ok = true; // for demo always success
  const paymentTxHash = `${paymentProvider}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return { ok, paymentTxHash };
}

export async function donate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const { campaignMongoId, amountVND, paymentProvider = "VNPay" } = req.body;

  try {
    const campaign = await Campaign.findById(campaignMongoId);
    if (!campaign) return res.status(404).json({ ok: false, message: "Campaign not found" });

    // 1) mock payment success
    const pay = mockPayment(Number(amountVND), paymentProvider);
    if (!pay.ok) return res.status(402).json({ ok: false, message: "Payment failed" });

    // 2) record on-chain (backendRecorder wallet)
    const { contract } = getEthContract();
    const tx = await contract.recordDonation(
      campaign.blockchainCampaignId,
      Number(amountVND),
      pay.paymentTxHash
    );
    const receipt = await tx.wait();

    // 3) save MongoDB transaction
    const savedTx = await DonationTransaction.create({
      campaignId: campaign._id,
      amountVND: Number(amountVND),
      blockchainTxHash: tx.hash,
      paymentTxHash: pay.paymentTxHash
    });

    // 4) update campaign totalRaised (off-chain)
    campaign.totalRaised += Number(amountVND);
    await campaign.save();

    return res.json({
      ok: true,
      message: "Donation success",
      data: {
        donation: savedTx,
        campaign
      },
      blockchain: {
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err.message || "Server error" });
  }
}

export async function listDonationsByCampaign(req, res) {
  try {
    const { campaignMongoId } = req.params;

    const items = await DonationTransaction.find({ campaignId: campaignMongoId })
      .sort({ createdAt: -1 });

    return res.json({ ok: true, data: items });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}
