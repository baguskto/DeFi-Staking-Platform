#!/bin/bash

echo "================================================"
echo "🚀 DeFi Staking Platform - Deployment Helper"
echo "================================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file found!"
    echo ""
else
    echo "📝 Creating .env file..."
    echo ""
    echo "Please enter your MetaMask private key (without 0x prefix):"
    echo "⚠️  WARNING: Keep this PRIVATE! Never share it!"
    echo ""
    read -s PRIVATE_KEY

    echo "PRIVATE_KEY=$PRIVATE_KEY" > .env
    echo "POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology" >> .env

    echo ""
    echo "✅ .env file created!"
    echo ""
fi

# Check for POL balance
echo "Checking your wallet..."
echo "Address: 0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93"
echo ""
echo "Make sure you have POL tokens from the faucet!"
echo "Get them at: https://faucet.polygon.technology/"
echo ""
read -p "Do you have POL tokens in your wallet? (y/n): " has_tokens

if [ "$has_tokens" != "y" ]; then
    echo ""
    echo "Please get POL tokens from the faucet first:"
    echo "1. Go to: https://faucet.polygon.technology/"
    echo "2. Select 'Polygon Amoy' and 'POL'"
    echo "3. Verify with GitHub or X.com"
    echo "4. Enter your address: 0xAE9466Fe4A2112a17a916A73e896B92cEcA3Fd93"
    echo "5. Click Claim"
    echo ""
    exit 0
fi

echo ""
echo "================================================"
echo "📝 Deploying Smart Contracts to Polygon Amoy..."
echo "================================================"
echo ""

npx hardhat run scripts/deploy.js --network polygonAmoy

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "1. No POL tokens - get them from faucet"
    echo "2. Wrong private key - check MetaMask"
    echo "3. Not on Amoy network - add network to MetaMask"
    echo ""
    exit 1
fi

echo ""
echo "✅ Contracts deployed successfully!"
echo ""

# Transfer tokens
echo "💰 Transferring 10,000 STK tokens to your wallet..."
npx hardhat run scripts/transfer-tokens.js --network polygonAmoy

if [ $? -ne 0 ]; then
    echo "⚠️  Token transfer failed, but contracts are deployed"
    echo "You can transfer manually later"
fi

echo ""
echo "================================================"
echo "🔄 Updating Frontend..."
echo "================================================"
echo ""

node scripts/update-frontend.js

echo ""
echo "================================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "================================================"
echo ""

if [ -f deployment.json ]; then
    echo "📄 Contract Addresses:"
    cat deployment.json | grep -E "stakingToken|stakingRewards" | sed 's/,$//'
    echo ""
fi

echo "Next step: Run the frontend!"
echo ""
echo "Commands:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Your wallet will have 10,000 STK tokens ready to stake!"
echo ""
