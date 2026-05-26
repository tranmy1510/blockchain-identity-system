const { ethers } = require("ethers");
const contractABI = require("../blockchain/contractABI.json");

const getContract = () => {
  if (!process.env.RPC_URL) {
    throw new Error("Missing RPC_URL in .env");
  }

  if (!process.env.PRIVATE_KEY) {
    throw new Error("Missing PRIVATE_KEY in .env");
  }

  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error("Missing CONTRACT_ADDRESS in .env");
  }

  if (!ethers.isAddress(process.env.CONTRACT_ADDRESS)) {
    throw new Error("Invalid CONTRACT_ADDRESS in .env");
  }

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  return new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);
};

const normalizeBytes32Hash = (identityHash) => {
  if (!identityHash) {
    throw new Error("Identity hash is required");
  }

  const hash = identityHash.startsWith("0x")
    ? identityHash
    : `0x${identityHash}`;

  if (!ethers.isHexString(hash, 32)) {
    throw new Error("Identity hash must be a valid bytes32 hex string");
  }

  return hash;
};

const storeIdentityOnBlockchain = async (userId, identityHash) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const contract = getContract();

  const userIdString = userId.toString();
  const bytes32Hash = normalizeBytes32Hash(identityHash);

  const storeTx = await contract.storeIdentityHash(userIdString, bytes32Hash);
  const storeReceipt = await storeTx.wait();

  if (!storeReceipt || storeReceipt.status !== 1) {
    throw new Error("Store identity hash transaction failed");
  }

  const verifyTx = await contract.verifyIdentity(userIdString);
  const verifyReceipt = await verifyTx.wait();

  if (!verifyReceipt || verifyReceipt.status !== 1) {
    throw new Error("Verify identity transaction failed");
  }

  return {
    storeTxHash: storeTx.hash,
    verifyTxHash: verifyTx.hash,
  };
};

const getBlockchainVerificationStatus = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const contract = getContract();

  return await contract.getVerificationStatus(userId.toString());
};

const getBlockchainIdentityHash = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const contract = getContract();

  return await contract.getIdentityHash(userId.toString());
};

module.exports = {
  storeIdentityOnBlockchain,
  getBlockchainVerificationStatus,
  getBlockchainIdentityHash,
};