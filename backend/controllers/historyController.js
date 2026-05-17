const HistoryLog = require("../models/HistoryLog");

const getMyHistory = async (req, res) => {
  try {
    const history = await HistoryLog.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Get history failed",
      error: error.message,
    });
  }
};

module.exports = {
  getMyHistory,
};