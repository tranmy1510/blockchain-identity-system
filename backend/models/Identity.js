const mongoose = require("mongoose");

const identitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    documentId: {
      type: String,
      required: [true, "Document ID is required"],
      trim: true,
      unique: true,
      index: true,
      match: [
        /^[0-9]{12}$/,
        "Document ID must contain exactly 12 digits",
      ],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [255, "Address cannot exceed 255 characters"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^(0[0-9]{9}|\+84[0-9]{9})$/.test(value);
        },
        message: "Phone number must be valid, for example 0912345678 or +84912345678",
      },
    },

    idPhoto: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Not Submitted", "Pending", "Verified", "Rejected"],
      default: "Not Submitted",
    },

    identityHash: {
      type: String,
      default: null,
    },

    blockchainTxHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Identity", identitySchema);