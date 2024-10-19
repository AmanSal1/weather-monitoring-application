const mongoose = require("mongoose");

const realtimeData = new mongoose.Schema({
  city: String,
  temperature: Number,
  humidity: Number,
  wind_speed: Number,
  main_condition: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("realtimeData", realtimeData);
