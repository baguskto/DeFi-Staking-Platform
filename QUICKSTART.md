# Quick Start Guide

Deploy and test in 5 minutes! ⚡

## Prerequisites

- MetaMask installed
- Your wallet: `0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93`

## Step 1: Get Free Testnet MATIC (2 minutes)

1. Go to: https://faucet.polygon.technology/
2. Connect MetaMask
3. Select "Mumbai" network
4. Click "Submit" to get free MATIC
5. Wait 1-2 minutes

## Step 2: Configure Environment (30 seconds)

Get your private key from MetaMask:
1. MetaMask → Three dots → Account Details
2. Show Private Key → Enter password
3. Copy the key

Create `.env` file in project root:
```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

## Step 3: Deploy Everything (1 command!)

```bash
./quick-deploy.sh
```

This will:
- ✅ Deploy StakingToken contract
- ✅ Deploy StakingRewards contract
- ✅ Fund rewards pool with 500,000 tokens
- ✅ Transfer 10,000 STK tokens to your wallet
- ✅ Update frontend automatically

## Step 4: Run Frontend

```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Step 5: Test!

1. **Connect Wallet** → Click "Connect Wallet" → Select MetaMask
2. **Stake** → Enter 100 → Approve → Stake
3. **Watch Rewards** → Updates every 10 seconds
4. **Claim** → Click "Claim Rewards"
5. **Withdraw** → Enter amount → Withdraw

## Manual Deployment (if quick-deploy.sh doesn't work)

```bash
# 1. Deploy contracts
npx hardhat run scripts/deploy.js --network polygonMumbai

# 2. Transfer tokens to your wallet
npx hardhat run scripts/transfer-tokens.js --network polygonMumbai

# 3. Update frontend
node scripts/update-frontend.js

# 4. Run frontend
cd frontend && npm run dev
```

## Troubleshooting

**"Insufficient funds"**
→ Get Mumbai MATIC from faucet (Step 1)

**"Network not found"**
→ Add Mumbai to MetaMask:
- Network: Mumbai Testnet
- RPC: https://rpc-mumbai.maticvigil.com
- Chain ID: 80001
- Currency: MATIC

**"Module not found"**
→ Run: `npm install && cd frontend && npm install`

**Deployment fails**
→ Check:
1. `.env` file exists with valid private key
2. You have Mumbai MATIC in your wallet
3. You're connected to internet

## Contract Addresses

After deployment, find addresses in:
- `deployment.json` (automatically created)
- `frontend/app/constants.ts` (automatically updated)

View on Mumbai PolygonScan:
- https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS

## Test Accounts

Your wallet gets 10,000 STK tokens automatically for testing.

Want to test with another account?
```bash
npx hardhat run scripts/transfer-tokens.js --network polygonMumbai
# (Edit the recipient address in the script first)
```

## Ready to Go Live?

1. Update `hardhat.config.cjs` with Polygon mainnet config
2. Get real MATIC
3. Deploy to mainnet
4. Update frontend config

---

Need help? Check `DEPLOY_GUIDE.md` for detailed instructions.
