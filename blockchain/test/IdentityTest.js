const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("IdentityManagement Contract", function () {
  let identityManagement;
  const userId = "user_demo_123";
  const identityHash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

  // Trước khi chạy mỗi bài test, triển khai lại contract mới để sạch dữ liệu
  beforeEach(async function () {
    const IdentityManagement = await ethers.getContractFactory("IdentityManagement");
    identityManagement = await IdentityManagement.deploy();
    await identityManagement.deployed();
  });

  // 1. Test lưu hash thành công
  it("Should store identity hash correctly", async function () {
    await expect(identityManagement.storeIdentityHash(userId, identityHash))
      .to.emit(identityManagement, "IdentityStored")
      .withArgs(userId, identityHash, anyValue);
  });

  // 2. Test verify user thành công
  it("Should verify identity correctly", async function () {
    await identityManagement.storeIdentityHash(userId, identityHash);

    await expect(identityManagement.verifyIdentity(userId))
      .to.emit(identityManagement, "IdentityVerified")
      .withArgs(userId, anyValue);

    const status = await identityManagement.getVerificationStatus(userId);
    expect(status).to.equal(true);
  });

  // 3. Test get status đúng
  it("Should return correct verification status", async function () {
    await identityManagement.storeIdentityHash(userId, identityHash);

    let status = await identityManagement.getVerificationStatus(userId);
    expect(status).to.equal(false);

    await identityManagement.verifyIdentity(userId);
    status = await identityManagement.getVerificationStatus(userId);
    expect(status).to.equal(true);
  });

  // 4. Test get hash đúng
  it("Should return the correct stored identity hash", async function () {
    await identityManagement.storeIdentityHash(userId, identityHash);

    const storedHash = await identityManagement.getIdentityHash(userId);
    expect(storedHash).to.equal(identityHash);
  });

  // 5. Test verify user chưa store thì revert
  it("Should revert when verifying non-existent identity", async function () {
    await expect(
      identityManagement.verifyIdentity("user_khong_ton_tai")
    ).to.be.revertedWith("Identity dung khong ton tai");
  });
});