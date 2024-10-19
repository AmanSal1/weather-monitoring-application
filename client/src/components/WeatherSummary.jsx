import { useState, useEffect } from "react";
import axios from "axios";

const WeatherSummary = () => {
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherSummaries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/daily-weather-summary"
        );
        setSummaries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather summaries:", error);
        setError("Error fetching weather summaries");
        setLoading(false);
      }
    };

    fetchWeatherSummaries();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Today&apos;s Weather Summary
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : summaries.length === 0 ? (
        <p className="text-center">No weather data available</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">City</th>
              <th className="border border-gray-300 p-2">
                Avg Temperature (°C)
              </th>
              <th className="border border-gray-300 p-2">
                Max Temperature (°C)
              </th>
              <th className="border border-gray-300 p-2">
                Min Temperature (°C)
              </th>
              <th className="border border-gray-300 p-2">Dominant Condition</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{summary.city}</td>
                <td className="border border-gray-300 p-2">
                  {summary.dailySummary.averageTemperature.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">
                  {summary.dailySummary.maximumTemperature.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">
                  {summary.dailySummary.minimumTemperature.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">
                  {summary.dailySummary.dominantWeatherCondition}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeatherSummary;
