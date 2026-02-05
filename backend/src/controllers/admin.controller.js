import User from "../models/User.js";

export async function listOrganizations(req, res) {
  const { status = "pending" } = req.query; // pending | verified | all
  const filter = { accountType: "organization" };

  if (status === "pending") filter.orgVerified = false;
  if (status === "verified") filter.orgVerified = true;

  const items = await User.find(filter).select("-passwordHash").sort({ createdAt: -1 });
  return res.json({ ok: true, data: items });
}

export async function verifyOrganization(req, res) {
  const { id } = req.params;
  const u = await User.findById(id);
  if (!u) return res.status(404).json({ ok: false, message: "User not found" });
  if (u.accountType !== "organization") return res.status(400).json({ ok: false, message: "Not an organization account" });

  u.orgVerified = true;
  await u.save();

  return res.json({ ok: true, message: "Organization verified", data: { id: u._id, orgVerified: u.orgVerified } });
}
