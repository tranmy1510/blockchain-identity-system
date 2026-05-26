const express = require("express");

const {
  requestAccess,
  getMyAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  checkVerificationByEmail,
  shareAccess,
  revokeAccess,
  getMyPermissions,
} = require("../controllers/accessController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/request",
  protect,
  authorizeRoles("thirdparty"),
  requestAccess
);

router.get(
  "/requests",
  protect,
  authorizeRoles("user"),
  getMyAccessRequests
);

router.put(
  "/request/:requestId/approve",
  protect,
  authorizeRoles("user"),
  approveAccessRequest
);

router.put(
  "/request/:requestId/reject",
  protect,
  authorizeRoles("user"),
  rejectAccessRequest
);

router.get(
  "/check",
  protect,
  authorizeRoles("thirdparty"),
  checkVerificationByEmail
);

router.post("/share", protect, authorizeRoles("user"), shareAccess);

router.put(
  "/revoke/:permissionId",
  protect,
  authorizeRoles("user"),
  revokeAccess
);

router.get(
  "/my-permissions",
  protect,
  authorizeRoles("user"),
  getMyPermissions
);

module.exports = router;