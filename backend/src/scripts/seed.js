import "dotenv/config";
import axios from "axios";

const BASE = `http://localhost:${process.env.PORT || 8080}/api`;

async function run() {
  console.log("Seeding via API:", BASE);

  const items = [
    {
      name: "Quỹ Trẻ Em Vùng Cao",
      description: "Hỗ trợ sách vở, áo ấm cho trẻ em vùng cao.",
      targetAmount: 200000000
    },
    {
      name: "Cứu Trợ Lũ Miền Trung",
      description: "Hỗ trợ thực phẩm, nhu yếu phẩm sau bão lũ.",
      targetAmount: 500000000
    }
  ];

  for (const c of items) {
    const r = await axios.post(`${BASE}/campaign`, c);
    console.log("✅ created:", r.data?.data?.name, "mongoId:", r.data?.data?._id, "chainId:", r.data?.blockchain?.campaignId);
  }

  console.log("Done seed.");
}

run().catch((e) => {
  console.error(e.response?.data || e.message);
  process.exit(1);
});
