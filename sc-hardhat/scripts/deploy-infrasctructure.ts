import { ethers } from "hardhat";

async function main() {
  const LoyaltyCore = await ethers.getContractFactory("LoyaltyCore");
  const core = await LoyaltyCore.deploy();
  console.log("LoyaltyCore deployed: ", core.target);

  const LoyaltyRouter = await ethers.getContractFactory("LoyaltyRouter");
  const router = await LoyaltyRouter.deploy(core.target);
  console.log("LoyaltyRouter deployed: ", router.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });