// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title StakingToken
 * @dev Simple ERC20 token used for staking in the DeFi platform
 * Users can stake this token to earn rewards
 */
contract StakingToken is ERC20, Ownable {
    /**
     * @dev Constructor that gives msg.sender an initial supply of tokens
     * @param initialSupply The initial supply of tokens (with 18 decimals)
     */
    constructor(uint256 initialSupply) ERC20("Staking Token", "STK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Allows owner to mint new tokens
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (with 18 decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Allows owner to burn tokens from an address
     * @param from Address from which to burn tokens
     * @param amount Amount of tokens to burn
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
