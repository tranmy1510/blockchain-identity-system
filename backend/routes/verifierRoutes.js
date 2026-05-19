const express = require("express");

const {
  getPendingIdentities,
  getIdentityDetail,
  approveIdentity,
  rejectIdentity,
} = require("../controllers/verifierController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Verifier: get all pending identities
router.get(
  "/pending",
  protect,
  authorizeRoles("verifier"),
  getPendingIdentities
);

// Verifier: get detail of one identity
router.get(
  "/identity/:id",
  protect,
  authorizeRoles("verifier"),
  getIdentityDetail
);

// Verifier: approve identity
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("verifier"),
  approveIdentity
);

// Verifier: reject identity
router.put(
  "/reject/:id",
  protect,
  authorizeRoles("verifier"),
  rejectIdentity
);

module.exports = router;