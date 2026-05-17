const { ethers } = require("ethers");
const contractABI = require("../blockchain/contractABI.json");

const getContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    wallet
  );

  return contract;
};

const storeIdentityOnBlockchain = async (userId, identityHash) => {
  const contract = getContract();

  const bytes32Hash = "0x" + identityHash;

  const tx1 = await contract.storeIdentityHash(userId.toString(), bytes32Hash);
  await tx1.wait();

  const tx2 = await contract.verifyIdentity(userId.toString());
  await tx2.wait();

  return tx2.hash;
};

module.exports = {
  storeIdentityOnBlockchain,
};