const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Updating frontend with deployed contract addresses...\n");

  // Read deployment info
  const deploymentPath = path.join(__dirname, "..", "deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ deployment.json not found!");
    console.error("Please deploy contracts first using: npx hardhat run scripts/deploy.js --network polygonMumbai");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

  const stakingToken = deploymentInfo.stakingToken;
  const stakingRewards = deploymentInfo.stakingRewards;

  console.log("Contract addresses from deployment.json:");
  console.log("StakingToken:", stakingToken);
  console.log("StakingRewards:", stakingRewards);
  console.log("");

  // Update constants.ts
  const constantsPath = path.join(__dirname, "..", "frontend", "app", "constants.ts");
  const constantsContent = `// Contract addresses - Auto-updated from deployment.json
export const STAKING_TOKEN_ADDRESS = '${stakingToken}' as \`0x\${string}\`;
export const STAKING_REWARDS_ADDRESS = '${stakingRewards}' as \`0x\${string}\`;

// Network: ${deploymentInfo.network}
// Deployed: ${deploymentInfo.timestamp}
// Deployer: ${deploymentInfo.deployer}
`;

  fs.writeFileSync(constantsPath, constantsContent);
  console.log("✅ Updated frontend/app/constants.ts");
  console.log("");
  console.log("You can now run the frontend:");
  console.log("  cd frontend");
  console.log("  npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
