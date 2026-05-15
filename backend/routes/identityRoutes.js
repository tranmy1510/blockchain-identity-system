const express = require("express");

const {
  createIdentity,
  getMyIdentity,
  updateIdentity,
  submitVerification,
  getVerificationStatus,
} = require("../controllers/identityController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("user"), createIdentity);

router.get("/me", protect, authorizeRoles("user"), getMyIdentity);

router.put("/me", protect, authorizeRoles("user"), updateIdentity);

router.put("/submit", protect, authorizeRoles("user"), submitVerification);

router.get("/status", protect, authorizeRoles("user"), getVerificationStatus);

module.exports = router;