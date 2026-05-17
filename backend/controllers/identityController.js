const Identity = require("../models/Identity");
const HistoryLog = require("../models/HistoryLog");

// Create identity
const createIdentity = async (req, res) => {
  try {
    const { fullName, dob, email, documentId, address } = req.body;

    if (!fullName || !dob || !email || !documentId || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingIdentity = await Identity.findOne({
      userId: req.user._id,
    });

    if (existingIdentity) {
      return res.status(400).json({
        success: false,
        message: "Identity already exists",
      });
    }

    const identity = await Identity.create({
      userId: req.user._id,
      fullName,
      dob,
      email,
      documentId,
      address,
    });

    await HistoryLog.create({
      userId: req.user._id,
      action: "CREATE_IDENTITY",
      description: "User created identity profile",
    });

    return res.status(201).json({
      success: true,
      message: "Identity created successfully",
      data: identity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Create identity failed",
      error: error.message,
    });
  }
};

// Get my identity
const getMyIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      userId: req.user._id,
    });

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
      message: "Get identity failed",
      error: error.message,
    });
  }
};

// Update my identity
const updateIdentity = async (req, res) => {
  try {
    const { fullName, dob, email, documentId, address } = req.body;

    const identity = await Identity.findOne({
      userId: req.user._id,
    });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    if (identity.status === "Verified") {
      return res.status(400).json({
        success: false,
        message: "Verified identity cannot be updated",
      });
    }

    identity.fullName = fullName || identity.fullName;
    identity.dob = dob || identity.dob;
    identity.email = email || identity.email;
    identity.documentId = documentId || identity.documentId;
    identity.address = address || identity.address;

    if (identity.status === "Rejected") {
      identity.status = "Not Submitted";
    }

    await identity.save();

    await HistoryLog.create({
      userId: req.user._id,
      action: "UPDATE_IDENTITY",
      description: "User updated identity profile",
    });

    return res.status(200).json({
      success: true,
      message: "Identity updated successfully",
      data: identity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update identity failed",
      error: error.message,
    });
  }
};

// Submit verification
const submitVerification = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      userId: req.user._id,
    });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    if (identity.status === "Verified") {
      return res.status(400).json({
        success: false,
        message: "Identity already verified",
      });
    }

    identity.status = "Pending";

    await identity.save();

    await HistoryLog.create({
      userId: req.user._id,
      action: "SUBMIT_VERIFICATION",
      description: "User submitted identity for verification",
    });

    return res.status(200).json({
      success: true,
      message: "Identity submitted for verification",
      data: identity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Submit verification failed",
      error: error.message,
    });
  }
};

// Get verification status
const getVerificationStatus = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      userId: req.user._id,
    }).select("status blockchainTxHash identityHash");

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: identity.status,
        identityHash: identity.identityHash,
        blockchainTxHash: identity.blockchainTxHash,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get verification status failed",
      error: error.message,
    });
  }
};

module.exports = {
  createIdentity,
  getMyIdentity,
  updateIdentity,
  submitVerification,
  getVerificationStatus,
};