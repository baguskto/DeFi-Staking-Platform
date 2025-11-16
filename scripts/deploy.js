const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

  // Deploy StakingToken
  console.log("Deploying StakingToken...");
  const StakingToken = await hre.ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy(1000000); // 1 million tokens
  await stakingToken.waitForDeployment();
  const stakingTokenAddress = await stakingToken.getAddress();
  console.log("✅ StakingToken deployed to:", stakingTokenAddress);

  // Deploy StakingRewards
  console.log("\nDeploying StakingRewards...");
  const StakingRewards = await hre.ethers.getContractFactory("StakingRewards");
  const stakingRewards = await StakingRewards.deploy(stakingTokenAddress);
  await stakingRewards.waitForDeployment();
  const stakingRewardsAddress = await stakingRewards.getAddress();
  console.log("✅ StakingRewards deployed to:", stakingRewardsAddress);

  // Transfer some tokens to StakingRewards for rewards pool
  console.log("\nFunding rewards pool...");
  const rewardAmount = hre.ethers.parseEther("500000"); // 500k tokens for rewards
  const tx = await stakingToken.transfer(stakingRewardsAddress, rewardAmount);
  await tx.wait();
  console.log("✅ Transferred 500,000 STK tokens to rewards pool");

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    stakingToken: stakingTokenAddress,
    stakingRewards: stakingRewardsAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to deployment.json");

  // Update .env.example with addresses
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("StakingToken:", stakingTokenAddress);
  console.log("StakingRewards:", stakingRewardsAddress);
  console.log("Deployer:", deployer.address);
  console.log("=".repeat(60));

  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n📝 To verify contracts on PolygonScan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${stakingTokenAddress} 1000000`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${stakingRewardsAddress} ${stakingTokenAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
