const express = require("express");
const { checkIdentity } = require("../controllers/thirdPartyController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/check/:userId",
  protect,
  authorizeRoles("thirdparty"),
  checkIdentity
);

module.exports = router;