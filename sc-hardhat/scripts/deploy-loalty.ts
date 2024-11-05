import { ethers } from "hardhat";

async function main() {
  const JRC1Bonus = await ethers.getContractFactory("JRC1Bonus");
  const bytecode = JRC1Bonus.bytecode;
  const abiCoder = new ethers.AbiCoder();
  const args = abiCoder.encode(
    ['uint256','uint256','uint256','uint256','bool'],
    ['10','80000000000000000000','1000000000000000000','100',false]
  );
  const meta = abiCoder.encode(
    ['string','string'], 
    ['BONUS','BONUS']
  );

  const LoyaltyRouter = await ethers.getContractFactory("LoyaltyRouter");
  const router = await LoyaltyRouter.attach("0xFA1Df1Ab04343A65D2E2aA2B80F2b21766F4B060");
  const result = await router.deployAndRegister.staticCall(bytecode, args, meta, '/');
  console.log(result);

  await router.deployAndRegister(bytecode, args, meta, '/');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });