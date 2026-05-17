const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityManagement Contract", function () {
  let identityManagement;
  const userId = "user_demo_123";
  // Giả lập một đoạn hash 32 bytes (64 ký tự hexa + "0x" ở đầu)
  const identityHash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

  // Trước khi chạy mỗi bài test, triển khai lại contract mới để sạch dữ liệu
  beforeEach(async function () {
    const IdentityManagement = await ethers.getContractFactory("IdentityManagement");
    identityManagement = await IdentityManagement.deploy();
    await identityManagement.deployed();
  });

  // 1. Test trường hợp store hash được không
  it("Should store identity hash correctly", async function () {
    await expect(identityManagement.storeIdentityHash(userId, identityHash))
      .to.emit(identityManagement, "IdentityStored")
      .withArgs(userId, identityHash, anyValue => true); // Kiểm tra xem có bắn ra event không
  });

  // 2. Test trường hợp verify user được không
  it("Should verify identity correctly", async function () {
    // Phải lưu hash trước rồi mới verify được
    await identityManagement.storeIdentityHash(userId, identityHash);

    await expect(identityManagement.verifyIdentity(userId))
      .to.emit(identityManagement, "IdentityVerified")
      .withArgs(userId, anyValue => true);

    // Kiểm tra xem trạng thái verified đã đổi sang true chưa
    const status = await identityManagement.getVerificationStatus(userId);
    expect(status).to.equal(true);
  });

  // 3. Test trường hợp get status đúng không
  it("Should return correct verification status", async function () {
    await identityManagement.storeIdentityHash(userId, identityHash);
    
    // Ban đầu chưa verify thì phải là false
    let status = await identityManagement.getVerificationStatus(userId);
    expect(status).to.equal(false);

    // Sau khi verify thì phải là true
    await identityManagement.verifyIdentity(userId);
    status = await identityManagement.getVerificationStatus(userId);
    expect(status).to.equal(true);
  });

  // 4. Test trường hợp get hash đúng không
  it("Should return the correct stored identity hash", async function () {
    await identityManagement.storeIdentityHash(userId, identityHash);
    
    const storedHash = await identityManagement.getIdentityHash(userId);
    expect(storedHash).to.equal(identityHash);
  });
});