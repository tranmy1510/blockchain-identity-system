const AccessPermission = require("../models/AccessPermission");
const User = require("../models/User");
const HistoryLog = require("../models/HistoryLog");

// User share access to third-party
const shareAccess = async (req, res) => {
  try {
    const { thirdPartyId, allowedFields } = req.body;

    if (!thirdPartyId) {
      return res.status(400).json({
        success: false,
        message: "Third-party ID is required",
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
      permission.allowedFields = allowedFields || permission.allowedFields;
      permission.isActive = true;
      await permission.save();
    } else {
      permission = await AccessPermission.create({
        userId: req.user._id,
        thirdPartyId,
        allowedFields: allowedFields || ["fullName", "email", "status"],
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
    }).populate("thirdPartyId", "name email role");

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
  shareAccess,
  revokeAccess,
  getMyPermissions,
};