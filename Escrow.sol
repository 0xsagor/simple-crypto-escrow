// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    address public payer;
    address public payee;
    uint256 public amount;
    bool public isFunded;
    bool public isCompleted;

    event Deposited(address indexed payer, uint256 amount);
    event Released(address indexed payee, uint256 amount);
    event Refunded(address indexed payer, uint256 amount);

    constructor(address _payee) {
        payer = msg.sender;
        payee = _payee;
    }

    // 1. Buyer sends money here
    function deposit() external payable {
        require(msg.sender == payer, "Only payer can deposit");
        require(!isFunded, "Already funded");
        
        amount = msg.value;
        isFunded = true;
        emit Deposited(payer, amount);
    }

    // 2. Buyer releases money to Seller
    function release() external {
        require(msg.sender == payer, "Only payer can release");
        require(address(this).balance > 0, "No funds to release");
        
        isCompleted = true;
        payable(payee).transfer(address(this).balance);
        emit Released(payee, amount);
    }

    // 3. Seller refunds money to Buyer (if they can't do the job)
    function refund() external {
        require(msg.sender == payee, "Only payee can refund");
        require(address(this).balance > 0, "No funds to refund");

        isCompleted = true;
        payable(payer).transfer(address(this).balance);
        emit Refunded(payer, amount);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
