// PASTE DEPLOYED CONTRACT ADDRESS HERE
const ESCROW_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

const ABI = [
    "function deposit() external payable",
    "function release() external",
    "function refund() external",
    "function payer() view returns (address)",
    "function payee() view returns (address)",
    "function getBalance() view returns (uint256)",
    "function isFunded() view returns (bool)"
];

let provider, signer, contract;

const connectBtn = document.getElementById("connectBtn");
const logDiv = document.getElementById("logs");

async function init() {
    if(!window.ethereum) return alert("Install MetaMask");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(ESCROW_ADDRESS, ABI, signer);

    const address = await signer.getAddress();
    connectBtn.innerText = address.substring(0, 6) + "...";
    
    refreshUI(address);
}

async function refreshUI(userAddress) {
    const balance = await contract.getBalance();
    const payer = await contract.payer();
    const payee = await contract.payee();
    const isFunded = await contract.isFunded();

    document.getElementById("balance").innerText = ethers.utils.formatEther(balance);
    
    // Determine Role
    if (userAddress.toLowerCase() === payer.toLowerCase()) {
        document.getElementById("buyerControls").classList.remove("hidden");
        document.getElementById("statusText").innerText = isFunded ? "Funds Locked" : "Awaiting Deposit";
        
        // Toggle buttons based on state
        document.getElementById("depositBtn").disabled = isFunded;
        document.getElementById("releaseBtn").disabled = !isFunded || balance.eq(0);
        
    } else if (userAddress.toLowerCase() === payee.toLowerCase()) {
        document.getElementById("sellerControls").classList.remove("hidden");
        document.getElementById("statusText").innerText = isFunded ? "Work in Progress" : "Waiting for Buyer";
        document.getElementById("refundBtn").disabled = !isFunded;
    } else {
        document.getElementById("statusText").innerText = "Observer Mode";
    }
}

function log(msg) { logDiv.innerText = msg; }

document.getElementById("depositBtn").onclick = async () => {
    const amt = document.getElementById("amountInput").value;
    if(!amt) return;
    try {
        log("Depositing...");
        const tx = await contract.deposit({ value: ethers.utils.parseEther(amt) });
        await tx.wait();
        log("Deposited!");
        window.location.reload();
    } catch(e) { log(e.message); }
};

document.getElementById("releaseBtn").onclick = async () => {
    try {
        log("Releasing funds...");
        const tx = await contract.release();
        await tx.wait();
        log("Funds Released to Seller!");
        window.location.reload();
    } catch(e) { log(e.message); }
};

document.getElementById("refundBtn").onclick = async () => {
    try {
        log("Refunding...");
        const tx = await contract.refund();
        await tx.wait();
        log("Refunded to Buyer.");
        window.location.reload();
    } catch(e) { log(e.message); }
};

connectBtn.onclick = init;
