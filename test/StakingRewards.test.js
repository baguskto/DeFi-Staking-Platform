const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("StakingRewards", function () {
  let stakingToken;
  let stakingRewards;
  let owner;
  let user1;
  let user2;

  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 million tokens
  const STAKE_AMOUNT = ethers.parseEther("100"); // 100 tokens

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy StakingToken
    const StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = await StakingToken.deploy(1000000); // 1 million tokens
    await stakingToken.waitForDeployment();

    // Deploy StakingRewards
    const StakingRewards = await ethers.getContractFactory("StakingRewards");
    stakingRewards = await StakingRewards.deploy(await stakingToken.getAddress());
    await stakingRewards.waitForDeployment();

    // Transfer some tokens to users for testing
    await stakingToken.transfer(user1.address, ethers.parseEther("10000"));
    await stakingToken.transfer(user2.address, ethers.parseEther("10000"));

    // Fund the staking contract with reward tokens
    await stakingToken.transfer(await stakingRewards.getAddress(), ethers.parseEther("100000"));
  });

  describe("Deployment", function () {
    it("Should set the correct staking token", async function () {
      expect(await stakingRewards.stakingToken()).to.equal(await stakingToken.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await stakingRewards.owner()).to.equal(owner.address);
    });

    it("Should have initial reward rate of 10%", async function () {
      expect(await stakingRewards.rewardRate()).to.equal(1000); // 10% = 1000 basis points
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT);
      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);

      const stakeInfo = await stakingRewards.stakes(user1.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT);
    });

    it("Should update total staked amount", async function () {
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT);
      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);

      expect(await stakingRewards.totalStaked()).to.equal(STAKE_AMOUNT);
    });

    it("Should emit Staked event", async function () {
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT);

      await expect(stakingRewards.connect(user1).stake(STAKE_AMOUNT))
        .to.emit(stakingRewards, "Staked")
        .withArgs(user1.address, STAKE_AMOUNT);
    });

    it("Should reject stakes below minimum", async function () {
      const tooSmall = ethers.parseEther("0.5");
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), tooSmall);

      await expect(
        stakingRewards.connect(user1).stake(tooSmall)
      ).to.be.revertedWith("Amount below minimum stake");
    });

    it("Should allow multiple stakes from same user", async function () {
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT * 2n);

      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);
      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);

      const stakeInfo = await stakingRewards.stakes(user1.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT * 2n);
    });
  });

  describe("Rewards", function () {
    beforeEach(async function () {
      // User stakes tokens
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT);
      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should calculate rewards correctly after 1 year", async function () {
      // Fast forward 1 year
      await time.increase(365 * 24 * 60 * 60);

      const rewards = await stakingRewards.calculateRewards(user1.address);
      const expectedReward = ethers.parseEther("10"); // 10% of 100 tokens

      // Allow for small rounding differences
      expect(rewards).to.be.closeTo(expectedReward, ethers.parseEther("0.01"));
    });

    it("Should calculate rewards correctly after 30 days", async function () {
      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const rewards = await stakingRewards.calculateRewards(user1.address);
      // Expected: 100 * 10% * (30/365) ≈ 0.82 tokens
      const expectedReward = ethers.parseEther("0.82");

      expect(rewards).to.be.closeTo(expectedReward, ethers.parseEther("0.01"));
    });

    it("Should allow users to claim rewards", async function () {
      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const balanceBefore = await stakingToken.balanceOf(user1.address);

      await stakingRewards.connect(user1).claimRewards();

      const balanceAfter = await stakingToken.balanceOf(user1.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("Should emit RewardClaimed event", async function () {
      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      await expect(stakingRewards.connect(user1).claimRewards())
        .to.emit(stakingRewards, "RewardClaimed");
    });

    it("Should reset reward calculation after claim", async function () {
      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      await stakingRewards.connect(user1).claimRewards();

      // Rewards should be near zero after claim
      const rewards = await stakingRewards.calculateRewards(user1.address);
      expect(rewards).to.be.lt(ethers.parseEther("0.01"));
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT);
      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should allow users to withdraw staked tokens", async function () {
      const withdrawAmount = ethers.parseEther("50");

      await stakingRewards.connect(user1).withdraw(withdrawAmount);

      const stakeInfo = await stakingRewards.stakes(user1.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT - withdrawAmount);
    });

    it("Should return tokens to user on withdrawal", async function () {
      const balanceBefore = await stakingToken.balanceOf(user1.address);

      await stakingRewards.connect(user1).withdraw(STAKE_AMOUNT);

      const balanceAfter = await stakingToken.balanceOf(user1.address);
      expect(balanceAfter).to.be.gt(balanceBefore); // Greater because of rewards
    });

    it("Should claim rewards when withdrawing", async function () {
      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const balanceBefore = await stakingToken.balanceOf(user1.address);

      await stakingRewards.connect(user1).withdraw(STAKE_AMOUNT);

      const balanceAfter = await stakingToken.balanceOf(user1.address);
      // Should get staked amount + rewards
      expect(balanceAfter - balanceBefore).to.be.gt(STAKE_AMOUNT);
    });

    it("Should emit Withdrawn event", async function () {
      await expect(stakingRewards.connect(user1).withdraw(STAKE_AMOUNT))
        .to.emit(stakingRewards, "Withdrawn")
        .withArgs(user1.address, STAKE_AMOUNT);
    });

    it("Should reject withdrawal of more than staked", async function () {
      await expect(
        stakingRewards.connect(user1).withdraw(STAKE_AMOUNT * 2n)
      ).to.be.revertedWith("Insufficient staked amount");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update reward rate", async function () {
      await stakingRewards.setRewardRate(2000); // 20%
      expect(await stakingRewards.rewardRate()).to.equal(2000);
    });

    it("Should emit RewardRateUpdated event", async function () {
      await expect(stakingRewards.setRewardRate(2000))
        .to.emit(stakingRewards, "RewardRateUpdated")
        .withArgs(2000);
    });

    it("Should reject reward rate over 100%", async function () {
      await expect(
        stakingRewards.setRewardRate(10001)
      ).to.be.revertedWith("Rate cannot exceed 100%");
    });

    it("Should prevent non-owner from updating reward rate", async function () {
      await expect(
        stakingRewards.connect(user1).setRewardRate(2000)
      ).to.be.reverted;
    });

    it("Should allow owner to withdraw excess tokens", async function () {
      const excessAmount = ethers.parseEther("1000");

      await stakingRewards.withdrawExcess(excessAmount);

      const ownerBalance = await stakingToken.balanceOf(owner.address);
      expect(ownerBalance).to.be.gt(0);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await stakingToken.connect(user1).approve(await stakingRewards.getAddress(), STAKE_AMOUNT);
      await stakingRewards.connect(user1).stake(STAKE_AMOUNT);
    });

    it("Should return correct balance including rewards", async function () {
      // Fast forward 30 days
      await time.increase(30 * 24 * 60 * 60);

      const balance = await stakingRewards.balanceOf(user1.address);
      expect(balance).to.be.gt(STAKE_AMOUNT);
    });

    it("Should return correct stake info", async function () {
      const [amount, stakedAt, lastClaimedAt, pendingRewards] =
        await stakingRewards.getStakeInfo(user1.address);

      expect(amount).to.equal(STAKE_AMOUNT);
      expect(stakedAt).to.be.gt(0);
      expect(lastClaimedAt).to.be.gt(0);
      expect(pendingRewards).to.equal(0); // Initially zero
    });
  });
});
