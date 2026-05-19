const { ethers, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=== Đang tiến hành deploy Smart Contract... ===");

  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);

  // Lấy thông tin contract đã compile
  const IdentityManagement = await ethers.getContractFactory("IdentityManagement");

  // Tiến hành deploy (Hardhat v2 + ethers v5)
  const identityManagement = await IdentityManagement.deploy();
  await identityManagement.deployed();

  const contractAddress = identityManagement.address;

  console.log("=========================================");
  console.log("DEPLOY CONTRACT THANH CONG");
  console.log(`Contract Address: ${contractAddress}`);
  console.log("=========================================");

  // Tự động copy ABI sang backend
  const artifact = await artifacts.readArtifact("IdentityManagement");
  const backendABIPath = path.join(__dirname, "../../backend/blockchain/contractABI.json");

  fs.writeFileSync(backendABIPath, JSON.stringify(artifact.abi, null, 2));
  console.log(`ABI da copy sang: ${backendABIPath}`);

  // Hướng dẫn cập nhật .env
  console.log("\n=== Cập nhật backend/.env ===");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log("RPC_URL=http://127.0.0.1:8545");
  console.log("=====================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });