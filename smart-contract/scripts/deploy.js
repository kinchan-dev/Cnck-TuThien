const hre = require("hardhat");

async function main() {
  const TransparentCharity = await hre.ethers.getContractFactory("TransparentCharity");
  const contract = await TransparentCharity.deploy();
  await contract.waitForDeployment();

  console.log("TransparentCharity deployed to:", await contract.getAddress());
  console.log("Deployer/owner:", (await hre.ethers.getSigners())[0].address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
