const AccessPermission = require("../models/AccessPermission");
const AccessRequest = require("../models/AccessRequest");
const Identity = require("../models/Identity");
const User = require("../models/User");
const HistoryLog = require("../models/HistoryLog");

const ALLOWED_FIELDS = ["fullName", "email", "status", "dob", "address", "phone"];

const filterValidFields = (fields = []) => {
  return fields.filter((field) => ALLOWED_FIELDS.includes(field));
};

const buildSharedData = (identity, allowedFields = []) => {
  const sharedData = {};

  allowedFields.forEach((field) => {
    if (field === "status") {
      sharedData.status = identity.status;
    } else if (identity[field] !== undefined && identity[field] !== null) {
      sharedData[field] = identity[field];
    }
  });

  return sharedData;
};

// Third-party requests access by user email
const requestAccess = async (req, res) => {
  try {
    const { userEmail, requestedFields } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const validRequestedFields = filterValidFields(requestedFields);

    if (validRequestedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please request at least one valid field",
      });
    }

    const targetUser = await User.findOne({
      email: userEmail.trim().toLowerCase(),
      role: "user",
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot request access to yourself",
      });
    }

    const identity = await Identity.findOne({ userId: targetUser._id });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "This user has not created an identity profile yet",
      });
    }

    let request = await AccessRequest.findOne({
      requesterId: req.user._id,
      targetUserId: targetUser._id,
      status: "Pending",
    });

    if (request) {
      request.requestedFields = validRequestedFields;
      await request.save();
    } else {
      request = await AccessRequest.create({
        requesterId: req.user._id,
        targetUserId: targetUser._id,
        requestedFields: validRequestedFields,
      });
    }

    await HistoryLog.create({
      userId: targetUser._id,
      action: "ACCESS_REQUEST_RECEIVED",
      description: `${req.user.name || "Third-party"} requested access to identity fields`,
    });

    return res.status(201).json({
      success: true,
      message: "Access request sent successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Request access failed",
      error: error.message,
    });
  }
};

// User views pending requests
const getMyAccessRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({
      targetUserId: req.user._id,
      status: "Pending",
    })
      .populate("requesterId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get access requests failed",
      error: error.message,
    });
  }
};

// User approves request and chooses fields
const approveAccessRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approvedFields } = req.body;

    const validApprovedFields = filterValidFields(approvedFields);

    if (validApprovedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please approve at least one valid field",
      });
    }

    const request = await AccessRequest.findOne({
      _id: requestId,
      targetUserId: req.user._id,
      status: "Pending",
    }).populate("requesterId", "name email role");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Pending access request not found",
      });
    }

    let permission = await AccessPermission.findOne({
      userId: req.user._id,
      thirdPartyId: request.requesterId._id,
    });

    if (permission) {
      permission.allowedFields = validApprovedFields;
      permission.isActive = true;
      await permission.save();
    } else {
      permission = await AccessPermission.create({
        userId: req.user._id,
        thirdPartyId: request.requesterId._id,
        allowedFields: validApprovedFields,
        isActive: true,
      });
    }

    request.status = "Approved";
    request.approvedFields = validApprovedFields;
    await request.save();

    await HistoryLog.create({
      userId: req.user._id,
      action: "ACCESS_REQUEST_APPROVED",
      description: `User approved access request from ${request.requesterId.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Access request approved successfully",
      data: {
        request,
        permission,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Approve access request failed",
      error: error.message,
    });
  }
};

// User rejects request
const rejectAccessRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await AccessRequest.findOne({
      _id: requestId,
      targetUserId: req.user._id,
      status: "Pending",
    }).populate("requesterId", "name email role");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Pending access request not found",
      });
    }

    request.status = "Rejected";
    request.approvedFields = [];
    await request.save();

    await HistoryLog.create({
      userId: req.user._id,
      action: "ACCESS_REQUEST_REJECTED",
      description: `User rejected access request from ${request.requesterId.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Access request rejected successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Reject access request failed",
      error: error.message,
    });
  }
};

// Third-party checks verification by user email
const checkVerificationByEmail = async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const targetUser = await User.findOne({
      email: userEmail.trim().toLowerCase(),
      role: "user",
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const identity = await Identity.findOne({ userId: targetUser._id });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    const permission = await AccessPermission.findOne({
      userId: targetUser._id,
      thirdPartyId: req.user._id,
      isActive: true,
    });

    const hasAccess = !!permission;

    return res.status(200).json({
      success: true,
      data: {
        userEmail: targetUser.email,
        isVerified: identity.status === "Verified",
        status: identity.status,
        hasAccess,
        identityHash: hasAccess ? identity.identityHash : null,
        blockchainTxHash: hasAccess ? identity.blockchainTxHash : null,
        sharedData: hasAccess
          ? buildSharedData(identity, permission.allowedFields)
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Check verification failed",
      error: error.message,
    });
  }
};

// Keep old direct sharing API, optional
const shareAccess = async (req, res) => {
  try {
    const { thirdPartyId, allowedFields } = req.body;

    if (!thirdPartyId) {
      return res.status(400).json({
        success: false,
        message: "Third-party ID is required",
      });
    }

    const validAllowedFields = filterValidFields(allowedFields);

    if (validAllowedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one valid field",
      });
    }

    const thirdParty = await User.findById(thirdPartyId);

    if (!thirdParty || thirdParty.role !== "thirdparty") {
      return res.status(404).json({
        success: false,
        message: "Third-party not found",
      });
    }

    let permission = await AccessPermission.findOne({
      userId: req.user._id,
      thirdPartyId,
    });

    if (permission) {
      permission.allowedFields = validAllowedFields;
      permission.isActive = true;
      await permission.save();
    } else {
      permission = await AccessPermission.create({
        userId: req.user._id,
        thirdPartyId,
        allowedFields: validAllowedFields,
        isActive: true,
      });
    }

    await HistoryLog.create({
      userId: req.user._id,
      action: "SHARE_ACCESS",
      description: `User shared access with ${thirdParty.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Access shared successfully",
      data: permission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Share access failed",
      error: error.message,
    });
  }
};

// User revoke access
const revokeAccess = async (req, res) => {
  try {
    const { permissionId } = req.params;

    const permission = await AccessPermission.findOne({
      _id: permissionId,
      userId: req.user._id,
    }).populate("thirdPartyId", "name email role");

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    permission.isActive = false;
    await permission.save();

    await HistoryLog.create({
      userId: req.user._id,
      action: "REVOKE_ACCESS",
      description: `User revoked access from ${permission.thirdPartyId.name}`,
    });

    return res.status(200).json({
      success: true,
      message: "Access revoked successfully",
      data: permission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Revoke access failed",
      error: error.message,
    });
  }
};

// User get my shared permissions
const getMyPermissions = async (req, res) => {
  try {
    const permissions = await AccessPermission.find({
      userId: req.user._id,
    })
      .populate("thirdPartyId", "name email role")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get permissions failed",
      error: error.message,
    });
  }
};

module.exports = {
  requestAccess,
  getMyAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  checkVerificationByEmail,
  shareAccess,
  revokeAccess,
  getMyPermissions,
};