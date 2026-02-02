const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Deployer address:", signer.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
