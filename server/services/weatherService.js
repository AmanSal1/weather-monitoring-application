const axios = require("axios");
const nodemailer = require("nodemailer");
const Alerts = require("../models/alerts");
require("dotenv").config();

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

let userThresholds = {
  temperature: {
    high: 20,
    count: 1,
  },
  weatherCondition: "Rain",
};

let lastWeatherData = {};
let breachCount = {};

const apiKey = process.env.OPENWEATHER_API_KEY;

const kelvinToCelsius = (temp) => (temp - 273.15).toFixed(2);

const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    const { main, weather, wind, dt } = response.data;

    return {
      city,
      temperature: kelvinToCelsius(main.temp),
      feels_like: kelvinToCelsius(main.feels_like),
      humidity: main.humidity,
      wind_speed: wind.speed,
      main_condition: weather[0].main,
      timestamp: dt * 1000,
    };
  } catch (error) {
    console.error(`Error fetching data for ${city}: `, error.message);
  }
};

const fetchWeatherForAllCities = async () => {
  const weatherData = await Promise.all(cities.map(fetchWeatherData));
  return weatherData.filter((data) => data);
};

function calculateDailySummary(aggregates) {
  const summary = {
    averageTemperature: null,
    maximumTemperature: null,
    minimumTemperature: null,
    dominantWeatherCondition: null,
  };

  const totalTemperature = aggregates.temperature.reduce(
    (acc, temp) => acc + temp,
    0
  );
  summary.averageTemperature = totalTemperature / aggregates.temperature.length;

  summary.maximumTemperature = Math.max(...aggregates.temperature);
  summary.minimumTemperature = Math.min(...aggregates.temperature);

  const conditionCount = aggregates.mainCondition.reduce((acc, condition) => {
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {});

  const dominantCondition = Object.keys(conditionCount).reduce((a, b) =>
    conditionCount[a] > conditionCount[b] ? a : b
  );

  summary.dominantWeatherCondition = dominantCondition;

  return summary;
}

const sendEmailAlert = async (message, city) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_EMAIL,
      subject: "Weather Alert",
      text: message,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    await logAlertToDatabase(city, message);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

const alertThresholds = (weatherData) => {
  const { temperature, city } = weatherData;

  if (temperature > userThresholds.temperature.high) {
    breachCount[city] = (breachCount[city] || 0) + 1;
    if (breachCount[city] >= userThresholds.temperature.count) {
      const message = `Alert: ${city} temperature exceeded ${userThresholds.temperature.high} °C for ${userThresholds.temperature.count} consecutive updates.`;
      console.log(message);
      sendEmailAlert(message, city);
    }
  } else {
    breachCount[city] = 0;
  }

  if (weatherData.main_condition === userThresholds.weatherCondition) {
    const conditionMessage = `Alert: ${city} is experiencing ${userThresholds.weatherCondition}.`;
    console.log(conditionMessage);
    sendEmailAlert(conditionMessage);
  }

  lastWeatherData[city] = weatherData;
};

const logAlertToDatabase = async (city, message) => {
  const alert = new Alerts({ city, message });
  try {
    await alert.save();
    console.log(`Logged alert for ${city}: ${message}`);
  } catch (error) {
    console.error("Error logging alert to DB:", error.message);
  }
};

module.exports = {
  cities,
  fetchWeatherForAllCities,
  calculateDailySummary,
  alertThresholds,
};
