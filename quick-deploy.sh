#!/bin/bash

echo "================================================"
echo "DeFi Staking Platform - Quick Deploy"
echo "================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Please create a .env file with:"
    echo "PRIVATE_KEY=your_private_key_without_0x"
    echo "POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com"
    echo ""
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Deploy contracts
echo "📝 Deploying contracts to Polygon Amoy..."
npx hardhat run scripts/deploy.js --network polygonAmoy

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    echo "Make sure you have Amoy MATIC in your wallet"
    echo "Get free testnet MATIC from: https://faucet.polygon.technology/"
    exit 1
fi

echo ""
echo "✅ Contracts deployed successfully!"
echo ""

# Transfer tokens to your address
echo "💰 Transferring 10,000 STK tokens to your wallet..."
npx hardhat run scripts/transfer-tokens.js --network polygonAmoy

echo ""
echo "================================================"
echo "🎉 Deployment Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Copy contract addresses from deployment.json"
echo "2. Update frontend/app/constants.ts"
echo "3. Run: cd frontend && npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "Your wallet: 0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93"
echo "You have 10,000 STK tokens ready to stake!"
echo ""
