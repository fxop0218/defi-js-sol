const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../helper-function")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const rewardToken = await deployments.get("RewardToken")

    log("###################################")
    const args = [rewardToken.address, rewardToken.address]

    const stakingDeployments = await deploy("Staking", {
        from: deployer,
        args: args,
        log: true,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log(`Verifying ${stakingDeployments.address}`)
        await verify(stakingDeployments.address, args)
    }

    log("Staking deployed")
    log("###########################################")
}
