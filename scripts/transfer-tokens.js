const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Read deployment info
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));

  const stakingTokenAddress = deploymentInfo.stakingToken;
  const recipientAddress = "0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93";
  const amount = hre.ethers.parseEther("10000"); // 10,000 STK tokens

  console.log("Transferring tokens...");
  console.log("Token Address:", stakingTokenAddress);
  console.log("Recipient:", recipientAddress);
  console.log("Amount:", hre.ethers.formatEther(amount), "STK\n");

  // Get the token contract
  const stakingToken = await hre.ethers.getContractAt("StakingToken", stakingTokenAddress);

  // Transfer tokens
  const tx = await stakingToken.transfer(recipientAddress, amount);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("✅ Transfer complete!");

  // Check balance
  const balance = await stakingToken.balanceOf(recipientAddress);
  console.log("\nRecipient balance:", hre.ethers.formatEther(balance), "STK");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
