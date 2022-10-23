const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../helper-function")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = []
    const rewardToken = await deploy("RewardToken", { from: deployer, args: args, log: false })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log(`Verifying ${rewardToken.address}`)
        await verify(rewardToken.address, args)
    }
    log("RewardToken deployed")
    log("###########################################")
}
