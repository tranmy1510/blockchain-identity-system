const Identity = require("../models/Identity");
const HistoryLog = require("../models/HistoryLog");

// =======================
// Helper validation
// =======================
const validateIdentityInput = (data) => {
  const errors = [];

  const fullName = data.fullName ? String(data.fullName).trim() : "";
  const email = data.email ? String(data.email).trim().toLowerCase() : "";
  const documentId = data.documentId ? String(data.documentId).trim() : "";
  const address = data.address ? String(data.address).trim() : "";
  const phone = data.phone ? String(data.phone).trim() : "";
  const dob = data.dob;

  if (!fullName) {
    errors.push("Full name is required");
  } else if (fullName.length < 3) {
    errors.push("Full name must be at least 3 characters");
  }

  if (!dob) {
    errors.push("Date of birth is required");
  } else {
    const dobDate = new Date(dob);
    if (Number.isNaN(dobDate.getTime())) {
      errors.push("Date of birth is invalid");
    } else if (dobDate >= new Date()) {
      errors.push("Date of birth must be in the past");
    }
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Email format is invalid");
  }

  if (!documentId) {
    errors.push("Document ID is required");
  } else if (!/^[0-9]{12}$/.test(documentId)) {
    errors.push("Document ID must contain exactly 12 digits");
  }

  if (!address) {
    errors.push("Address is required");
  } else if (address.length < 5) {
    errors.push("Address must be at least 5 characters");
  }

  if (phone && !/^(0[0-9]{9}|\+84[0-9]{9})$/.test(phone)) {
    errors.push("Phone number must be valid, for example 0912345678 or +84912345678");
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData: {
      fullName,
      dob,
      email,
      documentId,
      address,
      phone,
      idPhoto: data.idPhoto || "",
    },
  };
};

// =======================
// Create identity
// =======================
const createIdentity = async (req, res) => {
  try {
    const { isValid, errors, cleanData } = validateIdentityInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Identity validation failed",
        errors,
      });
    }

    const existingIdentity = await Identity.findOne({
      userId: req.user._id,
    });

    if (existingIdentity) {
      return res.status(400).json({
        success: false,
        message: "Identity already exists for this account",
      });
    }

    const duplicatedDocument = await Identity.findOne({
      documentId: cleanData.documentId,
    });

    if (duplicatedDocument) {
      return res.status(400).json({
        success: false,
        message: "This Document ID has already been registered by another account",
      });
    }

    const identity = await Identity.create({
      userId: req.user._id,
      fullName: cleanData.fullName,
      dob: cleanData.dob,
      email: cleanData.email,
      documentId: cleanData.documentId,
      address: cleanData.address,
      phone: cleanData.phone,
      idPhoto: cleanData.idPhoto,
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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate identity data detected",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Create identity failed",
      error: error.message,
    });
  }
};

// =======================
// Get my identity
// =======================
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

// =======================
// Update my identity
// =======================
const updateIdentity = async (req, res) => {
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
        message: "Verified identity cannot be updated",
      });
    }

    const mergedData = {
      fullName: req.body.fullName ?? identity.fullName,
      dob: req.body.dob ?? identity.dob,
      email: req.body.email ?? identity.email,
      documentId: req.body.documentId ?? identity.documentId,
      address: req.body.address ?? identity.address,
      phone: req.body.phone ?? identity.phone,
      idPhoto: req.body.idPhoto ?? identity.idPhoto,
    };

    const { isValid, errors, cleanData } = validateIdentityInput(mergedData);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Identity validation failed",
        errors,
      });
    }

    const duplicatedDocument = await Identity.findOne({
      documentId: cleanData.documentId,
      _id: { $ne: identity._id },
    });

    if (duplicatedDocument) {
      return res.status(400).json({
        success: false,
        message: "This Document ID has already been registered by another account",
      });
    }

    identity.fullName = cleanData.fullName;
    identity.dob = cleanData.dob;
    identity.email = cleanData.email;
    identity.documentId = cleanData.documentId;
    identity.address = cleanData.address;
    identity.phone = cleanData.phone;
    identity.idPhoto = cleanData.idPhoto;

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
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate identity data detected",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Update identity failed",
      error: error.message,
    });
  }
};

// =======================
// Submit verification
// =======================
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

    if (identity.status === "Pending") {
      return res.status(400).json({
        success: false,
        message: "Identity is already pending verification",
      });
    }

    const { isValid, errors } = validateIdentityInput(identity.toObject());

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Identity validation failed. Please update your identity before submitting.",
        errors,
      });
    }

    const duplicatedDocument = await Identity.findOne({
      documentId: identity.documentId,
      _id: { $ne: identity._id },
    });

    if (duplicatedDocument) {
      return res.status(400).json({
        success: false,
        message: "This Document ID has already been registered by another account",
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

// =======================
// Get verification status
// =======================
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