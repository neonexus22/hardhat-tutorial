const { task } = require("hardhat/config")

task(
    "block-number",
    "Prints the current block number",
    async (_, { ethers }) => {
        const blockNumber = await ethers.provider.getBlockNumber()
        console.log("Current block number: " + blockNumber)
    },
)
