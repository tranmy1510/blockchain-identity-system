const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedFields: {
      type: [String],
      default: ["fullName", "email", "status"],
    },

    approvedFields: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AccessRequest", accessRequestSchema);