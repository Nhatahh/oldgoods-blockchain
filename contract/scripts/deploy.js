import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const Factory = await ethers.getContractFactory("MarketplaceEscrowHash");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("MarketplaceEscrowHash deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
