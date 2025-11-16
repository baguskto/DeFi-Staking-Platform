const hre = require("hardhat");

async function main() {
  console.log("Starting local deployment for testing...\n");

  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Test User 1:", user1.address);
  console.log("Test User 2:", user2.address, "\n");

  // Deploy StakingToken
  console.log("Deploying StakingToken...");
  const StakingToken = await hre.ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy(1000000);
  await stakingToken.waitForDeployment();
  const stakingTokenAddress = await stakingToken.getAddress();
  console.log("✅ StakingToken:", stakingTokenAddress);

  // Deploy StakingRewards
  console.log("Deploying StakingRewards...");
  const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(stakingTokenAddress);
  await stakingRewards.waitForDeployment();
  const stakingRewardsAddress = await stakingRewards.getAddress();
  console.log("✅ StakingRewards:", stakingRewardsAddress);

  // Fund rewards pool
  console.log("\nFunding rewards pool...");
  await stakingToken.transfer(stakingRewardsAddress, hre.ethers.parseEther("500000"));
  console.log("✅ Rewards pool funded with 500,000 STK");

  // Distribute tokens to test users
  console.log("\nDistributing tokens to test users...");
  await stakingToken.transfer(user1.address, hre.ethers.parseEther("10000"));
  await stakingToken.transfer(user2.address, hre.ethers.parseEther("10000"));
  console.log("✅ Each test user received 10,000 STK");

  console.log("\n" + "=".repeat(60));
  console.log("LOCAL DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  console.log("StakingToken:", stakingTokenAddress);
  console.log("StakingRewards:", stakingRewardsAddress);
  console.log("=".repeat(60));
  console.log("\nYou can now interact with the contracts using these addresses");
  console.log("Run: npx hardhat node");
  console.log("Keep this terminal open and deploy this script in another terminal");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
