import { ethers } from "hardhat";

async function main() {

  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy();
  console.log("TokenFactory deployed: ", tokenFactory.target);
  
  await tokenFactory.deployERC20Bonuses("First deployed bonus");
  
  const LoyaltyFactory = await ethers.getContractFactory("LoyaltyFactory");
  const loyaltyFactory = await LoyaltyFactory.deploy();
  console.log("TokenFactory deployed: ", loyaltyFactory.target);
  
  // await loyaltyFactory.deployERC20Bonuses("First deployed bonus");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
