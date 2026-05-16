const express = require("express");
const { getMyHistory } = require("../controllers/historyController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, authorizeRoles("user"), getMyHistory);

module.exports = router;