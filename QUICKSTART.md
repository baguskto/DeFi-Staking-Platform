# Quick Start Guide - Polygon Amoy Testnet

Deploy and test in 5 minutes! ⚡

## Prerequisites

- MetaMask installed
- Your wallet: `0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93`

## Step 1: Get Free Testnet POL (2 minutes)

1. Go to: **https://faucet.polygon.technology/**
2. Select **"Polygon Amoy"** from the dropdown
3. Select **"POL Token"**
4. Connect your MetaMask or enter address: `0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93`
5. Complete verification (GitHub or X.com)
6. Click "Submit"
7. Wait 1-2 minutes for POL tokens

**Note**: Polygon Amoy uses POL token for gas (not MATIC)

## Step 2: Add Polygon Amoy to MetaMask

If you don't see Polygon Amoy in MetaMask:

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Click "Add a network manually"
4. Enter these details:
   - **Network Name**: Polygon Amoy Testnet
   - **RPC URL**: https://rpc-amoy.polygon.technology
   - **Chain ID**: 80002
   - **Currency Symbol**: POL
   - **Block Explorer**: https://amoy.polygonscan.com

## Step 3: Configure Environment (30 seconds)

Get your private key from MetaMask:
1. MetaMask → Three dots (•••) → Account Details
2. Show Private Key → Enter password
3. Copy the key

Create `.env` file in project root:
```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
```

## Step 4: Deploy Everything (1 command!)

```bash
./quick-deploy.sh
```

This will:
- ✅ Deploy StakingToken contract
- ✅ Deploy StakingRewards contract
- ✅ Fund rewards pool with 500,000 tokens
- ✅ Transfer 10,000 STK tokens to your wallet
- ✅ Update frontend automatically

## Step 5: Run Frontend

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000**

## Step 6: Test!

1. **Connect Wallet** → Click "Connect Wallet" → Select MetaMask
2. **Switch Network** → MetaMask will prompt you to switch to Polygon Amoy
3. **Stake** → Enter 100 → Approve → Stake
4. **Watch Rewards** → Updates every 10 seconds (10% APR)
5. **Claim** → Click "Claim Rewards"
6. **Withdraw** → Enter amount → Withdraw

## Manual Deployment (if quick-deploy.sh doesn't work)

```bash
# 1. Deploy contracts
npx hardhat run scripts/deploy.js --network polygonAmoy

# 2. Transfer tokens to your wallet
npx hardhat run scripts/transfer-tokens.js --network polygonAmoy

# 3. Update frontend
node scripts/update-frontend.js

# 4. Run frontend
cd frontend && npm run dev
```

## Troubleshooting

**"Insufficient funds"**
→ Get Amoy POL from faucet: https://faucet.polygon.technology/
→ Make sure you selected "Polygon Amoy" and "POL Token"

**"Network not found"**
→ Add Amoy network to MetaMask (see Step 2)

**"Module not found"**
→ Run: `npm install && cd frontend && npm install`

**Deployment fails**
→ Check:
1. `.env` file exists with valid private key (no 0x prefix)
2. You have Amoy POL in your wallet (not MATIC!)
3. You're connected to internet
4. MetaMask is on Polygon Amoy network

**Frontend shows wrong network**
→ Click network in MetaMask and switch to "Polygon Amoy Testnet"

## Important Notes

⚠️ **Polygon Mumbai is DEPRECATED** - Use Amoy instead!
- Old testnet: Mumbai (Chain ID 80001) - NO LONGER WORKS
- New testnet: Amoy (Chain ID 80002) - CURRENT

📌 **Network Details**:
- Chain ID: **80002**
- Gas Token: **POL** (not MATIC)
- RPC: https://rpc-amoy.polygon.technology
- Explorer: https://amoy.polygonscan.com

## Contract Addresses

After deployment, find addresses in:
- `deployment.json` (automatically created)
- `frontend/app/constants.ts` (automatically updated)

View on Amoy PolygonScan:
- https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS

## Verify Contracts (Optional)

After deployment:
```bash
npx hardhat verify --network polygonAmoy STAKING_TOKEN_ADDRESS 1000000
npx hardhat verify --network polygonAmoy STAKING_REWARDS_ADDRESS STAKING_TOKEN_ADDRESS
```

## Test Accounts

Your wallet gets 10,000 STK tokens automatically for testing.

Want to test with another account?
```bash
npx hardhat run scripts/transfer-tokens.js --network polygonAmoy
# (Edit the recipient address in the script first)
```

## Ready to Go Live?

1. Update `hardhat.config.cjs` with Polygon mainnet config
2. Get real POL tokens
3. Deploy to mainnet
4. Update frontend config

---

Need help? Check `DEPLOY_GUIDE.md` for detailed instructions.
