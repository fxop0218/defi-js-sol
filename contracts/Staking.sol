// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error Staking__NotEnoughETH();
error Staking__TransactionFailed();
error Staking__NeedsMoreThanZero();

contract Staking is ReentrancyGuard {
    // variables
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    uint256 public s_totalSupply;
    uint256 public constant REWARD_RATE = 100;
    uint256 public s_lastUpdateTime;
    uint256 public s_rewardPerTokenStored;

    mapping(address => uint256) public s_userRewardPerTokenPaid;
    mapping(address => uint256) s_stakingBalance;
    mapping(address => uint256) s_rewards;

    event Staked(address indexed user, uint256 indexed amount);
    event WithdrewStake(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);

    constructor(address stakingToken, address rewardToken) {
        s_stakingToken = IERC20(stakingToken);
        s_rewardToken = IERC20(rewardToken);
    }

    function stake(uint256 amount)
        external
        updateReward(msg.sender)
        moreThanZero(amount)
        nonReentrant
    {
        if (amount < 0) {
            revert Staking__NotEnoughETH();
        }
        s_stakingBalance[msg.sender] = s_stakingBalance[msg.sender] + amount;
        s_totalSupply = s_totalSupply + amount;

        bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);

        if (!success) {
            revert Staking__TransactionFailed();
        }

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) nonReentrant {
        if (amount > s_stakingBalance[msg.sender]) {
            revert Staking__NotEnoughETH();
        }

        s_stakingBalance[msg.sender] = s_stakingBalance[msg.sender] - amount;
        s_totalSupply = s_totalSupply - amount;

        bool success = s_stakingToken.transfer(msg.sender, amount);

        if (!success) {
            revert Staking__TransactionFailed();
        }

        emit WithdrewStake(msg.sender, amount);
    }

    function claimReward() external updateReward(msg.sender) nonReentrant {
        uint256 reward = s_rewards[msg.sender];
        s_rewards[msg.sender] = 0;
        emit RewardsClaimed(msg.sender, reward);
        bool success = s_rewardToken.transfer(msg.sender, reward);
        if (!success) {
            revert Staking__TransactionFailed();
        }

        emit RewardsClaimed(msg.sender, reward);
    }

    function rewardPerToken() public view returns (uint256) {
        if (s_totalSupply == 0) {
            return s_rewardPerTokenStored;
        }
        return
            s_rewardPerTokenStored +
            (((block.timestamp - s_lastUpdateTime) * REWARD_RATE * 1e18) / s_totalSupply);
    }

    /**
     * @notice How much reward a user has earned
     */
    function earned(address account) public view returns (uint256) {
        return
            ((s_stakingBalance[account] * (rewardPerToken() - s_userRewardPerTokenPaid[account])) /
                1e18) + s_rewards[account];
    }

    modifier updateReward(address account) {
        s_rewardPerTokenStored = rewardPerToken();
        s_lastUpdateTime = block.timestamp;
        s_rewards[account] = earned(account);
        s_userRewardPerTokenPaid[account] = s_rewardPerTokenStored;
        _;
    }

    modifier moreThanZero(uint256 amount) {
        if (amount <= 0) {
            revert Staking__NeedsMoreThanZero();
        }
        _;
    }

    // Getter function
    function getStaked(address account) public view returns (uint256) {
        return s_stakingBalance[account];
    }
}
