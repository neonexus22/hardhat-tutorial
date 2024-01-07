const { ethers } = require("hardhat")
const { expect } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with favourite number 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        expect(currentValue.toString()).to.equal(expectedValue)
    })

    it("Should update when we call store", async function () {
        const expectedValue = "22"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        const currentValue = await simpleStorage.retrieve()
        expect(currentValue.toString()).to.equal(expectedValue)
    })

    it("should add a person with a favourite number", async function () {
        const person = {
            favouriteNumber: 22,
            name: "Nishant",
        }

        const transactionResponse = await simpleStorage.addPerson(
            person.name,
            person.favouriteNumber,
        )
        await transactionResponse.wait(1)
        const personFromContract = await simpleStorage.people(0)

        expect(personFromContract.name).to.equal(person.name)
        const favouriteNumber = await simpleStorage.nameToFavoriteNumber(
            person.name,
        )
        expect(favouriteNumber.toString()).to.equal(
            person.favouriteNumber.toString(),
        )
    })
})
