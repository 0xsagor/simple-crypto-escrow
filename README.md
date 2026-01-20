# Simple Crypto Escrow

A "flat" architecture implementation of a secure payment escrow service. This dApp removes the need for a trusted third party by using smart contract logic to hold funds.

[Image of escrow smart contract workflow]

## 🛡️ How It Works
1. **Initialize**: A Buyer deploys the contract (or connects to one), specifying the **Seller's address**.
2. **Deposit**: The Buyer sends ETH to the contract.
3. **Work/Wait**: The funds are locked. The Seller sees the money is there but cannot touch it.
4. **Release**: Once the Buyer is satisfied with the work, they click "Release" to transfer ETH to the Seller.
5. **Refund**: If the deal is cancelled, the Seller can issue a refund back to the Buyer.

## 🚀 Quick Start

1. **Install**
   ```bash
   npm install
