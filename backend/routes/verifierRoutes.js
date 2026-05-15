const express = require("express");

const {
  getPendingIdentities,
  getIdentityDetail,
  approveIdentity,
  rejectIdentity,
} = require("../controllers/verifierController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/pending",
  protect,
  authorizeRoles("verifier"),
  getPendingIdentities
);

router.get(
  "/identity/:id",
  protect,
  authorizeRoles("verifier"),
  getIdentityDetail
);

router.put(
  "/approve/:id",
  protect,
  authorizeRoles("verifier"),
  approveIdentity
);

router.put(
  "/reject/:id",
  protect,
  authorizeRoles("verifier"),
  rejectIdentity
);

module.exports = router;