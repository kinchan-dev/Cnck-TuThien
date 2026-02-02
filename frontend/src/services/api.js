import axios from "axios";
import { API_BASE } from "./config";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000
});

export async function fetchCampaigns() {
  const r = await api.get("/campaign");
  return r.data.data;
}

export async function fetchCampaignDetail(id) {
  const r = await api.get(`/campaign/${id}`);
  return r.data; // {data, onchain}
}

export async function fetchDonationsByCampaign(campaignMongoId) {
  const r = await api.get(`/donations/${campaignMongoId}`);
  return r.data.data;
}

export async function donateVND(payload) {
  const r = await api.post("/donate", payload);
  return r.data;
}
