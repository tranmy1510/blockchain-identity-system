const crypto = require("crypto");

const generateIdentityHash = (identity) => {
  const data = [
    identity.fullName,
    identity.dob,
    identity.email,
    identity.documentId,
    identity.address,
  ].join("|");

  return crypto.createHash("sha256").update(data).digest("hex");
};

module.exports = generateIdentityHash;