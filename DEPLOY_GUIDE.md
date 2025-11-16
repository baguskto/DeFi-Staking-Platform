# Quick Deployment Guide for 0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93

## Step 1: Get Amoy Testnet MATIC (FREE)

1. **Visit the Amoy Faucet**:
   - Go to: https://faucet.polygon.technology/
   - Connect your MetaMask wallet
   - Select "Amoy" network
   - Select "MATIC Token"
   - Click "Submit"
   - Wait 1-2 minutes to receive test MATIC

2. **Note**: Polygon Amoy uses **POL** token for gas (not MATIC)

## Step 2: Get Your Private Key from MetaMask

⚠️ **SECURITY WARNING**: Never share your private key with anyone!

1. Open MetaMask
2. Click the three dots (•••) next to your account
3. Click "Account Details"
4. Click "Show Private Key"
5. Enter your password
6. Copy the private key

## Step 3: Configure Environment

```bash
# In the web3 directory, create .env file:
echo "PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE" > .env
echo "POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com" >> .env
```

Or manually create `.env` file:
```
PRIVATE_KEY=your_private_key_without_0x
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

## Step 4: Deploy Contracts

```bash
# Make sure you're in the web3 directory
cd /Users/baguskto/Downloads/Work/web3

# Deploy to Amoy testnet
npx hardhat run scripts/deploy.js --network polygonAmoy
```

You should see:
```
Deploying contracts with account: 0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93
Account balance: X.XX MATIC

✅ StakingToken deployed to: 0x...
✅ StakingRewards deployed to: 0x...
✅ Transferred 500,000 STK tokens to rewards pool
```

## Step 5: Update Frontend

1. Open `deployment.json` (created after deployment)
2. Copy the contract addresses
3. Update `frontend/app/constants.ts`:

```typescript
export const STAKING_TOKEN_ADDRESS = '0xYOUR_TOKEN_ADDRESS' as `0x${string}`;
export const STAKING_REWARDS_ADDRESS = '0xYOUR_REWARDS_ADDRESS' as `0x${string}`;
```

## Step 6: Get Test Tokens

You'll need some STK tokens to test. Run this script:

```bash
npx hardhat console --network polygonAmoy
```

Then in the console:
```javascript
const token = await ethers.getContractAt("StakingToken", "STAKING_TOKEN_ADDRESS_FROM_deployment.json");
await token.transfer("0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93", ethers.parseEther("10000"));
```

This gives you 10,000 STK tokens to test with.

## Step 7: Run Frontend

```bash
cd frontend
npm run dev
```

Open: http://localhost:3000

## Step 8: Test the DApp

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select MetaMask
   - Make sure you're on Amoy testnet

2. **Check Balance**
   - You should see 10,000 STK in your wallet

3. **Stake Tokens**
   - Enter amount (e.g., 100)
   - Click "Approve STK" → Confirm in MetaMask
   - Wait for confirmation
   - Click "Stake Tokens" → Confirm in MetaMask

4. **Watch Rewards**
   - Rewards update every 10 seconds
   - You earn 10% APR

5. **Claim Rewards**
   - Click "Claim Rewards" when you have rewards
   - Rewards go to your wallet

6. **Withdraw**
   - Enter amount to withdraw
   - Click "Withdraw Tokens"
   - Get your stake + rewards back

## Troubleshooting

### "Insufficient funds for gas"
- You need Amoy MATIC from the faucet

### "Network not found"
- Add Amoy network to MetaMask:
  - Network Name: Polygon Amoy Testnet
  - RPC URL: https://rpc-amoy.polygon.technology
  - Chain ID: 80002
  - Currency: POL
  - Block Explorer: https://amoy.polygonscan.com

### "Cannot find module"
- Run `npm install` in the root directory
- Run `npm install` in the frontend directory

### Contracts not showing data
- Make sure you updated `frontend/app/constants.ts` with correct addresses
- Check you're on Amoy network in MetaMask
- Verify you have test tokens

## Quick Commands Reference

```bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network polygonAmoy

# Run tests
npx hardhat test

# Start frontend
cd frontend && npm run dev

# View deployment info
cat deployment.json
```

## Your Wallet
Address: `0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93`

## Network Info
- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC**: https://rpc-amoy.polygon.technology
- **Explorer**: https://amoy.polygonscan.com
- **Gas Token**: POL (not MATIC)

## Support

If you encounter issues:
1. Check `deployment.json` for contract addresses
2. Verify `.env` has your private key
3. Ensure you have Amoy MATIC
4. Check MetaMask is on Amoy network
5. Look at browser console (F12) for errors

---

🎉 Once deployed, you can share your contract addresses with others to test too!
