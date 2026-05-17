const { ethers } = require("hardhat");

async function main() {
  console.log("=== Đang tiến hành deploy Smart Contract... ===");

  // Lấy thông tin contract đã compile
  const IdentityManagement = await ethers.getContractFactory("IdentityManagement");
  
  // Tiến hành deploy
  const identityManagement = await IdentityManagement.deploy();
  await identityManagement.deployed();

  console.log("=========================================");
  console.log("🎉 DEPLOY CONTRACT THÀNH CÔNG 🎉");
  console.log(`📍 Contract Address: ${identityManagement.address}`);
  console.log("=========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });