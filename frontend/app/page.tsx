'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useState, useEffect } from 'react';
import { STAKING_TOKEN_ADDRESS, STAKING_REWARDS_ADDRESS } from './constants';
import StakingRewardsABI from './StakingRewards.abi.json';
import StakingTokenABI from './StakingToken.abi.json';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Contracts setup
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: STAKING_TOKEN_ADDRESS,
    abi: StakingTokenABI,
    functionName: 'balanceOf',
    args: [address],
  });

  // Read staked amount
  const { data: stakeInfo, refetch: refetchStakeInfo } = useReadContract({
    address: STAKING_REWARDS_ADDRESS,
    abi: StakingRewardsABI,
    functionName: 'getStakeInfo',
    args: [address],
  });

  // Read pending rewards
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: STAKING_REWARDS_ADDRESS,
    abi: StakingRewardsABI,
    functionName: 'calculateRewards',
    args: [address],
  });

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: STAKING_TOKEN_ADDRESS,
    abi: StakingTokenABI,
    functionName: 'allowance',
    args: [address, STAKING_REWARDS_ADDRESS],
  });

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      refetchTokenBalance();
      refetchStakeInfo();
      refetchRewards();
      refetchAllowance();
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected, refetchTokenBalance, refetchStakeInfo, refetchRewards, refetchAllowance]);

  // Refresh after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      refetchTokenBalance();
      refetchStakeInfo();
      refetchRewards();
      refetchAllowance();
    }
  }, [isConfirmed, refetchTokenBalance, refetchStakeInfo, refetchRewards, refetchAllowance]);

  const handleApprove = async () => {
    if (!stakeAmount) return;
    try {
      writeContract({
        address: STAKING_TOKEN_ADDRESS,
        abi: StakingTokenABI,
        functionName: 'approve',
        args: [STAKING_REWARDS_ADDRESS, parseEther(stakeAmount)],
      });
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    try {
      writeContract({
        address: STAKING_REWARDS_ADDRESS,
        abi: StakingRewardsABI,
        functionName: 'stake',
        args: [parseEther(stakeAmount)],
      });
      setStakeAmount('');
    } catch (error) {
      console.error('Error staking:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    try {
      writeContract({
        address: STAKING_REWARDS_ADDRESS,
        abi: StakingRewardsABI,
        functionName: 'withdraw',
        args: [parseEther(withdrawAmount)],
      });
      setWithdrawAmount('');
    } catch (error) {
      console.error('Error withdrawing:', error);
    }
  };

  const handleClaim = async () => {
    try {
      writeContract({
        address: STAKING_REWARDS_ADDRESS,
        abi: StakingRewardsABI,
        functionName: 'claimRewards',
      });
    } catch (error) {
      console.error('Error claiming:', error);
    }
  };

  const stakedAmount = stakeInfo ? stakeInfo[0] : 0n;
  const needsApproval = !allowance || (allowance < parseEther(stakeAmount || '0'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              DeFi Staking Platform
            </h1>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to DeFi Staking
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Connect your wallet to start staking and earning rewards
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Wallet Balance</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {tokenBalance ? formatEther(tokenBalance) : '0'} STK
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Staked Amount</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {stakedAmount ? formatEther(stakedAmount) : '0'} STK
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Pending Rewards</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {pendingRewards ? formatEther(pendingRewards) : '0'} STK
                  </span>
                </div>
                <button
                  onClick={handleClaim}
                  disabled={isPending || isConfirming || !pendingRewards || pendingRewards === 0n}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {isPending || isConfirming ? 'Processing...' : 'Claim Rewards'}
                </button>
              </div>
            </div>

            {/* Stake/Withdraw Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Stake & Earn
              </h2>

              {/* Stake Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stake Tokens (10% APR)
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Amount to stake"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="mt-4 space-y-2">
                  {needsApproval ? (
                    <button
                      onClick={handleApprove}
                      disabled={isPending || isConfirming || !stakeAmount}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      {isPending || isConfirming ? 'Approving...' : 'Approve STK'}
                    </button>
                  ) : (
                    <button
                      onClick={handleStake}
                      disabled={isPending || isConfirming || !stakeAmount}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      {isPending || isConfirming ? 'Staking...' : 'Stake Tokens'}
                    </button>
                  )}
                </div>
              </div>

              {/* Withdraw Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdraw Tokens
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount to withdraw"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleWithdraw}
                  disabled={isPending || isConfirming || !withdrawAmount}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {isPending || isConfirming ? 'Withdrawing...' : 'Withdraw Tokens'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">1️⃣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Stake Tokens</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stake your STK tokens to start earning rewards at 10% APR
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Rewards accumulate automatically based on your staked amount
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Claim Anytime</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Withdraw your stake and claim rewards whenever you want
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
