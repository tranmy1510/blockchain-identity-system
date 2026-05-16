const express = require("express");

const {
  shareAccess,
  revokeAccess,
  getMyPermissions,
} = require("../controllers/accessController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/share", protect, authorizeRoles("user"), shareAccess);

router.put("/revoke/:permissionId", protect, authorizeRoles("user"), revokeAccess);

router.get("/my-permissions", protect, authorizeRoles("user"), getMyPermissions);

module.exports = router;