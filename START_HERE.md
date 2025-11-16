# 🚀 Quick Start - Deploy in 5 Minutes!

## You Need (2 things):

1. ✅ **POL tokens** from faucet (you just got these!)
2. 🔑 **MetaMask Private Key**

---

## Step 1: Get Your Private Key from MetaMask

1. Open **MetaMask**
2. Click the **three dots (•••)** next to your account name
3. Click **"Account Details"**
4. Click **"Show Private Key"**
5. Enter your MetaMask password
6. **Copy the private key** (will look like: abc123def456...)

⚠️ **Keep this PRIVATE!** Never share it with anyone!

---

## Step 2: Run the Deployment Helper

Open Terminal and run:

```bash
cd /Users/baguskto/Downloads/Work/web3
./deploy-helper.sh
```

The script will:
- ✅ Ask for your private key (paste it when prompted)
- ✅ Deploy both smart contracts to Polygon Amoy
- ✅ Transfer 10,000 STK tokens to your wallet
- ✅ Update the frontend automatically

---

## Step 3: Run the Frontend

After deployment completes:

```bash
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## What You Can Do:

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Check Balance** - See your 10,000 STK tokens
3. **Stake Tokens** - Stake and earn 10% APR
4. **Watch Rewards** - See rewards grow every 10 seconds
5. **Claim Rewards** - Claim anytime
6. **Withdraw** - Get your stake + rewards back

---

## Troubleshooting

**"Insufficient funds"**
→ Get more POL from: https://faucet.polygon.technology/

**"Invalid private key"**
→ Make sure you copied it correctly (no spaces, no 0x prefix)

**Frontend shows 0 tokens**
→ Wait a minute, then refresh the page
→ Make sure MetaMask is on Polygon Amoy network

**Can't connect wallet**
→ Add Polygon Amoy to MetaMask:
- Network Name: Polygon Amoy Testnet
- RPC URL: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Currency: POL

---

## Quick Commands

```bash
# Deploy everything
./deploy-helper.sh

# Run frontend
cd frontend && npm run dev

# Check deployment
cat deployment.json

# Run tests (optional)
npx hardhat test
```

---

## Need Help?

Check these files:
- `QUICKSTART.md` - Detailed guide
- `DEPLOY_GUIDE.md` - Step-by-step deployment
- `README.md` - Full documentation

---

**Your Wallet**: `0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93`
**Network**: Polygon Amoy (Chain ID: 80002)
**Ready to earn 10% APR!** 🎉
