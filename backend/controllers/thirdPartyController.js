const Identity = require("../models/Identity");
const AccessPermission = require("../models/AccessPermission");

const checkIdentity = async (req, res) => {
  try {
    const { userId } = req.params;

    const identity = await Identity.findOne({ userId });

    if (!identity) {
      return res.status(404).json({
        success: false,
        message: "Identity not found",
      });
    }

    const permission = await AccessPermission.findOne({
      userId,
      thirdPartyId: req.user._id,
      isActive: true,
    });

    const responseData = {
      userId,
      status: identity.status,
      isVerified: identity.status === "Verified",
      blockchainTxHash: identity.blockchainTxHash,
      identityHash: identity.identityHash,
      hasAccess: false,
      sharedData: {},
    };

    if (permission) {
      responseData.hasAccess = true;

      permission.allowedFields.forEach((field) => {
        if (identity[field] !== undefined) {
          responseData.sharedData[field] = identity[field];
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Identity check successful",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Check identity failed",
      error: error.message,
    });
  }
};

module.exports = {
  checkIdentity,
};