import { ethers } from "ethers";
import "dotenv/config";

// Minimal ABI for required functions
export const CONTRACT_ABI = [
  // ✅ Events (để parse receipt.logs)
  "event CampaignCreated(uint256 indexed campaignId, address indexed campaignOwner, string name, uint256 targetAmount)",
  "event DonationRecorded(uint256 indexed campaignId, uint256 amount, string txHash, uint256 indexed donationIndex)",
  "event BackendRecorderUpdated(address indexed oldRecorder, address indexed newRecorder)",
  "event Withdrawn(uint256 indexed campaignId, address indexed campaignOwner, uint256 amount)",

  // ✅ Functions
  "function createCampaign(string name, uint256 targetAmount) returns (uint256)",
  "function recordDonation(uint256 campaignId, uint256 amount, string txHash)",
  "function getCampaign(uint256 campaignId) view returns (uint256,address,string,uint256,uint256,uint256)",
  "function donationCount(uint256 campaignId) view returns (uint256)",
  "function getDonation(uint256 campaignId, uint256 index) view returns (uint256,string,uint256)",
  "function setBackendRecorder(address _recorder)",
  "function nextCampaignId() view returns (uint256)"
];



export function getEthContract() {
  const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

  if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
    throw new Error("Missing RPC_URL / PRIVATE_KEY / CONTRACT_ADDRESS in .env");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  return { provider, wallet, contract };
}
