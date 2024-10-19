const mongoose = require("mongoose");

const dailyWeatherSchema = new mongoose.Schema({
  date: { type: String },
  summaries: [],
});

module.exports = mongoose.model("dailyWeatherSummary", dailyWeatherSchema);
