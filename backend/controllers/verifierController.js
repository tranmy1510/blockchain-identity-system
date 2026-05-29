const Identity = require("../models/Identity");
const HistoryLog = require("../models/HistoryLog");
const generateIdentityHash = require("../utils/generateHash");
const { storeIdentityOnBlockchain } = require("../utils/blockchain");

// Get all pending identities
const getPendingIdentities = async (req, res) => {
  try {
    const identities = await Identity.find({ status: "Pending" })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: identities.length,
      data: identities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get pending identities failed",
      error: error.message,
    });
  }
};

// Get identity detail
const getIdentityDetail = async (req, res) => {
  try {
    const identity = await Identity.findById(req.params.id).populate(
      "userId",
      "name email role"
    );

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: identity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get identity detail failed",
      error: error.message,
    });
  }
};

// Approve identity
const approveIdentity = async (req, res) => {
  try {
    const identity = await Identity.findById(req.params.id);

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    if (identity.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending identity can be approved",
      });
    }

    const identityHash = generateIdentityHash({
      fullName: identity.fullName,
      dob: identity.dob,
      email: identity.email,
      documentId: identity.documentId,
      address: identity.address,
      phone: identity.phone || "",
    });

    let txHash;

    try {
      const blockchainResult = await storeIdentityOnBlockchain(
        identity.userId.toString(),
        identityHash
      );

      txHash = blockchainResult.verifyTxHash;
    } catch (blockchainError) {
      console.error("Blockchain store failed:", blockchainError);

      await HistoryLog.create({
        userId: identity.userId,
        action: "APPROVE_IDENTITY_FAILED",
        description:
          "Verifier attempted to approve identity, but blockchain transaction failed",
      });

      return res.status(500).json({
        success: false,
        message:
          "Blockchain transaction failed. Identity was not approved.",
        error: blockchainError.message,
      });
    }

    if (!txHash) {
      return res.status(500).json({
        success: false,
        message:
          "Blockchain transaction failed. No transaction hash returned.",
      });
    }

    identity.status = "Verified";
    identity.identityHash = identityHash;
    identity.blockchainTxHash = txHash;

    await identity.save();

    await HistoryLog.create({
      userId: identity.userId,
      action: "APPROVE_IDENTITY",
      description:
        "Verifier approved identity profile and stored hash on blockchain",
      txHash,
    });

    return res.status(200).json({
      success: true,
      message: "Identity approved successfully and stored on blockchain",
      data: identity,
    });
  } catch (error) {
    console.error("Approve identity error:", error);

    return res.status(500).json({
      success: false,
      message: "Approve identity failed",
      error: error.message,
    });
  }
};

// Reject identity
const rejectIdentity = async (req, res) => {
  try {
    const identity = await Identity.findById(req.params.id);

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    if (identity.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending identity can be rejected",
      });
    }

    identity.status = "Rejected";

    await identity.save();

    await HistoryLog.create({
      userId: identity.userId,
      action: "REJECT_IDENTITY",
      description: "Verifier rejected identity profile",
    });

    return res.status(200).json({
      success: true,
      message: "Identity rejected successfully",
      data: identity,
    });
  } catch (error) {
    console.error("Reject identity error:", error);

    return res.status(500).json({
      success: false,
      message: "Reject identity failed",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingIdentities,
  getIdentityDetail,
  approveIdentity,
  rejectIdentity,
};