const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  city: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Alerts", alertSchema);
