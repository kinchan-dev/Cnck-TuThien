import dotenv from "dotenv";
dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });

const API_BASE = process.env.SEED_API_BASE || "http://localhost:8080/api";

const samples = [
  {
    name: "Ủng hộ trẻ em vùng cao",
    description: "Gây quỹ mua áo ấm và sách vở cho học sinh vùng cao.",
    targetAmount: 20000000,
    category: "education",
  },
  {
    name: "Hỗ trợ đồng bào lũ lụt",
    description: "Cứu trợ khẩn cấp thực phẩm và nhu yếu phẩm.",
    targetAmount: 50000000,
    category: "disaster",
  },
  {
    name: "Quỹ hỗ trợ bệnh nhân",
    description: "Hỗ trợ viện phí cho bệnh nhân có hoàn cảnh khó khăn.",
    targetAmount: 30000000,
    category: "medical",
  },
];

async function http(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (!res.ok) {
    const msg = json?.message || JSON.stringify(json);
    throw new Error(`${method} ${url} -> ${res.status}: ${msg}`);
  }
  return json;
}

async function existsByName(name) {
  // listCampaigns supports q regex: /campaign?q=...
  const url = new URL(`${API_BASE}/campaign`);
  url.searchParams.set("q", name);
  const r = await http("GET", url.toString());
  const items = r?.data || [];
  return items.some((x) => (x?.name || "").trim().toLowerCase() === name.trim().toLowerCase());
}

async function main() {
  console.log("🌱 On-chain seed via API:", API_BASE);

  // quick health check
  await http("GET", `${API_BASE.replace(/\/api$/, "")}/health`);
  console.log("✅ Backend is up");

  for (const c of samples) {
    const ok = await existsByName(c.name);
    if (ok) {
      console.log("↩️ Skip (already exists):", c.name);
      continue;
    }

    console.log("➕ Creating on-chain campaign:", c.name);
    const created = await http("POST", `${API_BASE}/campaign`, c);

    console.log("✅ Created:", {
      mongoId: created?.data?._id,
      chainId: created?.data?.blockchainCampaignId,
      tx: created?.blockchain?.txHash,
    });
  }

  console.log("🎉 Seed done");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
