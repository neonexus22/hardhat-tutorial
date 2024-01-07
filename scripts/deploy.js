// imports
const { ethers, run, network } = require("hardhat")

// main
async function main() {
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying SimpleStorage...")
    const simpleStorageContract = await SimpleStorageFactory.deploy()
    console.log(
        "Contract deployed at",
        await simpleStorageContract.getAddress(),
    )
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorageContract.waitForDeployment(6)
        await verify(await simpleStorageContract.getAddress(), [])
    }

    const currentValue = await simpleStorageContract.retrieve()
    console.log(`Current value: ${currentValue.toString()}`)

    console.log("Updating value...")
    const simpleStorageContractRes = await simpleStorageContract.store(42)
    await simpleStorageContractRes.wait(1)
    const updateValue = await simpleStorageContract.retrieve()
    console.log(`Updated value: ${updateValue.toString()}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.log(error)
        }
    }
}

// call
main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
