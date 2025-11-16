// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingRewards
 * @dev A simple staking contract where users can stake tokens and earn rewards over time
 * Rewards are calculated based on a fixed APR (Annual Percentage Rate)
 */
contract StakingRewards is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // The token being staked
    IERC20 public immutable stakingToken;

    // Annual Percentage Rate (in basis points, 1000 = 10%)
    uint256 public rewardRate = 1000; // 10% APR by default

    // Total staked tokens
    uint256 public totalStaked;

    // Minimum stake amount (to prevent dust attacks)
    uint256 public constant MIN_STAKE = 1e18; // 1 token minimum

    // Struct to store user staking information
    struct StakeInfo {
        uint256 amount;           // Amount of tokens staked
        uint256 stakedAt;         // Timestamp when tokens were staked
        uint256 lastClaimedAt;    // Timestamp of last reward claim
    }

    // Mapping from user address to their stake information
    mapping(address => StakeInfo) public stakes;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    /**
     * @dev Constructor
     * @param _stakingToken Address of the token to be staked
     */
    constructor(address _stakingToken) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid token address");
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @dev Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount >= MIN_STAKE, "Amount below minimum stake");

        // If user already has stake, claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards();
        }

        // Transfer tokens from user to contract
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        // Update stake information
        if (stakes[msg.sender].amount == 0) {
            stakes[msg.sender] = StakeInfo({
                amount: amount,
                stakedAt: block.timestamp,
                lastClaimedAt: block.timestamp
            });
        } else {
            stakes[msg.sender].amount += amount;
        }

        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Withdraw staked tokens
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");

        // Claim pending rewards before withdrawal
        _claimRewards();

        // Update stake information
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;

        // Transfer tokens back to user
        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        _claimRewards();
    }

    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards() private {
        uint256 reward = calculateRewards(msg.sender);

        if (reward > 0) {
            stakes[msg.sender].lastClaimedAt = block.timestamp;

            // Transfer rewards to user
            stakingToken.safeTransfer(msg.sender, reward);

            emit RewardClaimed(msg.sender, reward);
        }
    }

    /**
     * @dev Calculate pending rewards for a user
     * @param user Address of the user
     * @return The amount of pending rewards
     */
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];

        if (userStake.amount == 0) {
            return 0;
        }

        // Calculate time elapsed since last claim
        uint256 timeElapsed = block.timestamp - userStake.lastClaimedAt;

        // Calculate reward: (stakedAmount * rewardRate * timeElapsed) / (365 days * 10000)
        // rewardRate is in basis points (10000 = 100%)
        uint256 reward = (userStake.amount * rewardRate * timeElapsed) / (365 days * 10000);

        return reward;
    }

    /**
     * @dev Get user's total balance (staked + rewards)
     * @param user Address of the user
     * @return Total balance including staked amount and pending rewards
     */
    function balanceOf(address user) external view returns (uint256) {
        return stakes[user].amount + calculateRewards(user);
    }

    /**
     * @dev Update the reward rate (only owner)
     * @param newRate New reward rate in basis points (1000 = 10%)
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10000, "Rate cannot exceed 100%");
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @dev Owner can withdraw excess tokens (for emergencies)
     * @param amount Amount to withdraw
     */
    function withdrawExcess(uint256 amount) external onlyOwner {
        uint256 balance = stakingToken.balanceOf(address(this));
        require(balance >= totalStaked + amount, "Cannot withdraw staked tokens");
        stakingToken.safeTransfer(msg.sender, amount);
    }

    /**
     * @dev Get stake information for a user
     * @param user Address of the user
     * @return amount Amount staked
     * @return stakedAt Timestamp when staked
     * @return lastClaimedAt Timestamp of last claim
     * @return pendingRewards Current pending rewards
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 stakedAt,
        uint256 lastClaimedAt,
        uint256 pendingRewards
    ) {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.stakedAt,
            userStake.lastClaimedAt,
            calculateRewards(user)
        );
    }
}
