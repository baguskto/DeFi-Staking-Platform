# DeFi Staking Platform

A full-stack decentralized finance (DeFi) staking platform built with Solidity, Hardhat, Next.js, and RainbowKit. Users can stake ERC20 tokens and earn rewards at a 10% annual percentage rate (APR).

## Features

- **Smart Contracts**
  - ERC20 Staking Token (STK)
  - Staking Rewards Contract with time-based reward calculation
  - Secure with OpenZeppelin contracts
  - Comprehensive test coverage (25 passing tests)

- **Frontend**
  - Next.js 15 with TypeScript
  - RainbowKit for wallet connection
  - Wagmi & Viem for blockchain interactions
  - Tailwind CSS for styling
  - Real-time balance and rewards display
  - Auto-refresh every 10 seconds

## Project Structure

```
web3/
├── contracts/              # Solidity smart contracts
│   ├── StakingToken.sol   # ERC20 token
│   └── StakingRewards.sol # Staking logic
├── test/                   # Contract tests
├── scripts/                # Deployment scripts
├── frontend/               # Next.js frontend
│   └── app/               # App router pages
├── hardhat.config.cjs     # Hardhat configuration
└── .env.example           # Environment variables template
```

## Prerequisites

- Node.js 18+ and npm
- MetaMask or another Web3 wallet
- Polygon Mumbai testnet MATIC (get from [faucet](https://faucet.polygon.technology/))

## Installation

### 1. Clone and Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Set Up Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add:
# - Your wallet private key
# - Polygon Mumbai RPC URL (optional, uses public RPC by default)
# - PolygonScan API key (optional, for contract verification)
```

## Smart Contract Development

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

All 25 tests should pass:
- Deployment tests
- Staking functionality
- Reward calculations
- Withdrawal operations
- Admin functions
- View functions

### Compile Contracts

```bash
npx hardhat compile
```

## Deployment

### Deploy to Polygon Mumbai Testnet

1. **Get Testnet MATIC**
   - Visit [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
   - Enter your wallet address
   - Wait for testnet MATIC

2. **Deploy Contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network polygonMumbai
   ```

3. **Save Deployment Info**
   - Contract addresses will be saved to `deployment.json`
   - Copy the addresses to `frontend/app/constants.ts`

4. **Verify Contracts (Optional)**
   ```bash
   npx hardhat verify --network polygonMumbai STAKING_TOKEN_ADDRESS 1000000
   npx hardhat verify --network polygonMumbai STAKING_REWARDS_ADDRESS STAKING_TOKEN_ADDRESS
   ```

### Deploy Locally for Testing

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy-local.js --network localhost
```

## Frontend Development

### 1. Update Contract Addresses

After deployment, update `/Users/baguskto/Downloads/Work/web3/frontend/app/constants.ts`:

```typescript
export const STAKING_TOKEN_ADDRESS = '0xYourStakingTokenAddress' as `0x${string}`;
export const STAKING_REWARDS_ADDRESS = '0xYourStakingRewardsAddress' as `0x${string}`;
```

### 2. Set Up WalletConnect (Optional)

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a project
3. Copy your Project ID
4. Create `frontend/.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

### 3. Run Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing in Production

### Step-by-Step Testing Guide

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your wallet (MetaMask recommended)
   - Approve connection
   - Switch to Polygon Mumbai network if prompted

2. **Get Test Tokens**
   - After deployment, the deployer has all tokens
   - Send some STK tokens to your test address using MetaMask or:
     ```bash
     npx hardhat console --network polygonMumbai
     ```
     ```javascript
     const token = await ethers.getContractAt("StakingToken", "TOKEN_ADDRESS");
     await token.transfer("YOUR_ADDRESS", ethers.parseEther("1000"));
     ```

3. **Approve & Stake Tokens**
   - Enter amount to stake (minimum 1 STK)
   - Click "Approve STK" and confirm transaction
   - Wait for confirmation
   - Click "Stake Tokens" and confirm transaction

4. **Watch Rewards Accumulate**
   - Rewards update automatically every 10 seconds
   - Formula: (stakedAmount × 10% × timeElapsed) / (365 days)

5. **Claim Rewards**
   - Click "Claim Rewards" to collect earned rewards
   - Rewards are sent to your wallet

6. **Withdraw Tokens**
   - Enter amount to withdraw (up to staked amount)
   - Click "Withdraw Tokens"
   - Automatically claims pending rewards

## Smart Contract Details

### StakingToken (STK)

- **Type**: ERC20
- **Initial Supply**: 1,000,000 STK
- **Decimals**: 18
- **Features**: Mintable, Burnable (owner only)

### StakingRewards

- **APR**: 10% (1000 basis points)
- **Minimum Stake**: 1 STK
- **Reward Calculation**: Continuous, based on time elapsed
- **Features**:
  - Stake tokens to earn rewards
  - Withdraw staked tokens
  - Claim accumulated rewards
  - Owner can update reward rate

## Frontend Features

- **Wallet Connection**: RainbowKit integration with multiple wallet support
- **Real-time Updates**: Auto-refresh balances and rewards every 10 seconds
- **Transaction Status**: Loading states and confirmation feedback
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Dark Mode**: Automatic dark mode support

## Troubleshooting

### Common Issues

1. **Tests Failing**
   - Ensure you're using compatible dependency versions
   - Check that you have `"type": "commonjs"` in package.json
   - Clear cache: `rm -rf cache artifacts`

2. **Frontend Won't Build**
   - Make sure contract addresses are updated in `constants.ts`
   - Check that ABIs were generated: `frontend/app/*.abi.json`
   - Verify all dependencies are installed

3. **Transactions Failing**
   - Ensure you have enough MATIC for gas
   - Check that you have STK tokens in your wallet
   - Verify you're on Polygon Mumbai network
   - Make sure contracts are deployed correctly

4. **RainbowKit Not Showing**
   - Check WalletConnect Project ID in `.env.local`
   - Verify providers are properly configured in `layout.tsx`

## Network Configuration

### Polygon Mumbai Testnet

- **Chain ID**: 80001
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Block Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

### Adding to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter Mumbai testnet details above
5. Save

## Gas Optimization

The contracts use OpenZeppelin's SafeERC20 and are optimized with:
- Compiler optimization enabled (200 runs)
- ReentrancyGuard for security
- Efficient storage patterns

## Security Considerations

- Contracts use OpenZeppelin's audited libraries
- ReentrancyGuard prevents reentrancy attacks
- Access control with Ownable pattern
- Minimum stake requirement prevents dust attacks
- SafeERC20 for token transfers

## License

MIT

## Support

For issues or questions:
1. Check deployment.json for correct addresses
2. Verify .env configuration
3. Check Polygon Mumbai block explorer for transactions
4. Review Hardhat and Next.js logs for errors

## Next Steps

- Deploy to Polygon mainnet (update network config)
- Add more features (compound staking, multiple reward tokens)
- Implement governance
- Add analytics dashboard
- Create mobile app

---

Built with ❤️ for learning Web3 and DeFi development
