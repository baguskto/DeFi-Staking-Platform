# Quick Deployment Guide for 0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93

## Step 1: Get Mumbai Testnet MATIC (FREE)

1. **Visit the Mumbai Faucet**:
   - Go to: https://faucet.polygon.technology/
   - Connect your MetaMask wallet
   - Select "Mumbai" network
   - Select "MATIC Token"
   - Click "Submit"
   - Wait 1-2 minutes to receive test MATIC

2. **Alternative Faucets** (if first one doesn't work):
   - https://mumbaifaucet.com/
   - https://faucet.quicknode.com/polygon/mumbai

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
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

## Step 4: Deploy Contracts

```bash
# Make sure you're in the web3 directory
cd /Users/baguskto/Downloads/Work/web3

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network polygonMumbai
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
npx hardhat console --network polygonMumbai
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
   - Make sure you're on Mumbai testnet

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
- You need Mumbai MATIC from the faucet

### "Network not found"
- Add Mumbai network to MetaMask:
  - Network Name: Mumbai Testnet
  - RPC URL: https://rpc-mumbai.maticvigil.com
  - Chain ID: 80001
  - Currency: MATIC
  - Block Explorer: https://mumbai.polygonscan.com

### "Cannot find module"
- Run `npm install` in the root directory
- Run `npm install` in the frontend directory

### Contracts not showing data
- Make sure you updated `frontend/app/constants.ts` with correct addresses
- Check you're on Mumbai network in MetaMask
- Verify you have test tokens

## Quick Commands Reference

```bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network polygonMumbai

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
- **Network**: Polygon Mumbai Testnet
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com

## Support

If you encounter issues:
1. Check `deployment.json` for contract addresses
2. Verify `.env` has your private key
3. Ensure you have Mumbai MATIC
4. Check MetaMask is on Mumbai network
5. Look at browser console (F12) for errors

---

🎉 Once deployed, you can share your contract addresses with others to test too!
