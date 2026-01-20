const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
  it("Should handle the full flow", async function () {
    const [buyer, seller] = await ethers.getSigners();
    
    // Deploy
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(seller.address);
    await escrow.deployed();

    // Deposit
    await escrow.connect(buyer).deposit({ value: ethers.utils.parseEther("1.0") });
    expect(await escrow.getBalance()).to.equal(ethers.utils.parseEther("1.0"));

    // Check Seller balance before release
    const sellerBalanceBefore = await seller.getBalance();

    // Release
    await escrow.connect(buyer).release();
    
    // Verify
    expect(await escrow.getBalance()).to.equal(0);
    const sellerBalanceAfter = await seller.getBalance();
    
    // Seller should have ~1.0 ETH more
    expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
  });
});
