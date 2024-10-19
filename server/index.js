const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const cors = require("cors");
require("dotenv").config();

const weatherService = require("./services/weatherService");
const realtimeData = require("./models/realtimeData");
const dailyWeatherSummary = require("./models/dailyWeatherSummary");
const Alerts = require("./models/alerts");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  });

app.get("/api/daily-weather-summary", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const weatherPromises = weatherService.cities.map(async (city) => {
      const data = await realtimeData.find({
        city,
      });

      const filteredData = data.filter((entry) => {
        const entryDate = new Date(entry.timestamp).toISOString().split("T")[0];
        return entryDate === currentDate;
      });

      const aggregates = {
        temperature: [],
        humidity: [],
        windSpeed: [],
        mainCondition: [],
        timestamps: [],
      };

      filteredData.forEach((entry) => {
        aggregates.temperature.push(entry.temperature);
        aggregates.humidity.push(entry.humidity);
        aggregates.windSpeed.push(entry.wind_speed);
        aggregates.mainCondition.push(entry.main_condition);
        aggregates.timestamps.push(entry.timestamp);
      });

      const dailySummary = weatherService.calculateDailySummary(aggregates);
      return { city, dailySummary };
    });

    const results = await Promise.all(weatherPromises);

    const finalSummary = new dailyWeatherSummary({
      date: currentDate,
      summaries: results,
    });

    await dailyWeatherSummary.deleteMany({ date: currentDate });

    await finalSummary.save();

    res.json(results);
  } catch (error) {
    console.error("Error fetching daily weather summaries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/historical-trends", async (req, res) => {
  try {
    const historicalTrendsData = await dailyWeatherSummary.find({});
    res.json(historicalTrendsData);
  } catch (error) {
    console.error("Error fetching historical trends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await Alerts.find().sort({ timestamp: -1 }).limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).send("Error fetching alerts.");
  }
});

cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Fetching weather data...");
    const weatherData = await weatherService.fetchWeatherForAllCities();
    await realtimeData.insertMany(weatherData);
    for (const data of weatherData) {
      weatherService.alertThresholds(data);
    }
    console.log("Realtime weather data processed successfully");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
