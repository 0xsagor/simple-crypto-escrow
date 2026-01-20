const hre = require("hardhat");

async function main() {
  const [deployer, sellerAccount] = await hre.ethers.getSigners();

  // We deploy with the first account (Buyer), setting the second account as Seller
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(sellerAccount.address);

  await escrow.deployed();

  console.log("Escrow Contract deployed to:", escrow.address);
  console.log("Buyer (You):", deployer.address);
  console.log("Seller (Target):", sellerAccount.address);
  console.log("Copy the Escrow Address into app.js!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
