import { validationResult } from "express-validator";
import Campaign from "../models/Campaign.js";
import { getEthContract } from "../config/eth.js";
import DonationTransaction from "../models/DonationTransaction.js";

export async function createCampaign(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const { name, description = "", targetAmount, category = "other" } = req.body;

  try {
    // 1) create on-chain campaign (triệt để, không parse event)
    const { contract } = getEthContract();
    const target = BigInt(targetAmount);

    // Lấy trước campaignId sẽ được trả về (không tốn gas)
    const predictedId = await contract.createCampaign.staticCall(name, target);

    // Gửi tx thật
    const tx = await contract.createCampaign(name, target);
    await tx.wait();

    // campaignId chuẩn
    const blockchainCampaignId = predictedId.toString();

    // 2) create in MongoDB
    const doc = await Campaign.create({
      name,
      description,
      category, // ✅ thêm
      targetAmount: Number(targetAmount),
      totalRaised: 0,
      blockchainCampaignId: Number(blockchainCampaignId), // ✅ ép kiểu Number cho khớp schema
    });

    return res.json({
      ok: true,
      data: doc,
      blockchain: { txHash: tx.hash, campaignId: blockchainCampaignId },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: err.message || "Server error" });
  }
}

export async function listCampaigns(req, res) {
  try {
    const { q = "", category = "" } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    const items = await Campaign.find(filter).sort({ createdAt: -1 });
    return res.json({ ok: true, data: items });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}

export async function getCampaignById(req, res) {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ ok: false, message: "Campaign not found" });

    // also fetch on-chain snapshot for transparency
    const { contract } = getEthContract();
    const chain = await contract.getCampaign(campaign.blockchainCampaignId);

    return res.json({
      ok: true,
      data: campaign,
      onchain: {
        id: Number(chain[0]),
        owner: chain[1],
        name: chain[2],
        targetAmount: Number(chain[3]),
        totalDonations: Number(chain[4]),
        donationCount: Number(chain[5]),
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}

export async function listCampaignTransactions(req, res) {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ ok: false, message: "Campaign not found" });

    // campaignId trong DonationTransaction là ObjectId ref Campaign => tìm bằng id (string) OK
    const rows = await DonationTransaction.find({ campaignId: id }).sort({ createdAt: -1 });
    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
}
