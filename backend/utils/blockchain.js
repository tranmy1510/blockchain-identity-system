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

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  return new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    wallet
  );
};

const normalizeBytes32Hash = (identityHash) => {
  if (!identityHash) {
    throw new Error("Identity hash is required");
  }

  if (identityHash.startsWith("0x")) {
    return identityHash;
  }

  return `0x${identityHash}`;
};

const storeIdentityOnBlockchain = async (userId, identityHash) => {
  const contract = getContract();

  const userIdString = userId.toString();
  const bytes32Hash = normalizeBytes32Hash(identityHash);

  const tx1 = await contract.storeIdentityHash(userIdString, bytes32Hash);
  await tx1.wait();

  const tx2 = await contract.verifyIdentity(userIdString);
  await tx2.wait();

  return tx2.hash;
};

module.exports = {
  storeIdentityOnBlockchain,
};