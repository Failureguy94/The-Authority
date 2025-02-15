let provider, signer, auctionContract;
let auctionAddress = "0xYourDutchAuctionContractAddress"; // Replace with your deployed contract address
let nftAddress = "0xYourNFTContractAddress"; // Replace with your NFT contract address

const auctionABI = [
  "function getPrice() external view returns (uint256)",
  "function buy() external payable",
  "function expiresAt() external view returns (uint256)"
];

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    auctionContract = new ethers.Contract(auctionAddress, auctionABI, signer);
    document.getElementById("connectButton").style.display = "none";
    document.getElementById("buyButton").style.display = "block";

    // Display auction data
    loadAuctionData();
  } else {
    alert("Please install MetaMask!");
  }
}

async function loadAuctionData() {
  const price = await auctionContract.getPrice();
  const expiresAt = await auctionContract.expiresAt();

  // Update UI with auction details
  document.getElementById("currentPrice").innerText = ethers.utils.formatEther(price);
  
  const timeRemaining = Math.max(expiresAt - Math.floor(Date.now() / 1000), 0);
  document.getElementById("timeRemaining").innerText = `${Math.floor(timeRemaining / 60)} minutes`;

  // If auction has expired, disable the buy button
  if (timeRemaining === 0) {
    document.getElementById("buyButton").disabled = true;
  }
}

async function buyNFT() {
  const price = await auctionContract.getPrice();
  const transaction = await auctionContract.buy({ value: price });
  await transaction.wait();

  alert("NFT Purchased!");
  loadAuctionData(); // Refresh data after purchase
}

// Set up event listeners
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("buyButton").addEventListener("click", buyNFT);
