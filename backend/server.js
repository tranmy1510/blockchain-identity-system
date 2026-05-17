const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const identityRoutes = require("./routes/identityRoutes");
const verifierRoutes = require("./routes/verifierRoutes");
const thirdPartyRoutes = require("./routes/thirdPartyRoutes");
const accessRoutes = require("./routes/accessRoutes");
const historyRoutes = require("./routes/historyRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blockchain Identity System API is running");
});

app.use("/api/auth", authRoutes);

app.use("/api/identity", identityRoutes);

app.use("/api/verifier", verifierRoutes);

app.use("/api/thirdparty", thirdPartyRoutes);

app.use("/api/access", accessRoutes);

app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});