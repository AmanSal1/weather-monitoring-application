import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const HistoricalTrends = () => {
  const [historicalTrendsData, setHistoricalTrendsData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalTrendsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/historical-trends"
        );
        setHistoricalTrendsData(response.data);
      } catch (error) {
        console.error("Error fetching historical trends:", error);
        setError("Error fetching historical trends");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalTrendsData();
  }, []);

  const chartData = [];
  historicalTrendsData.forEach(({ date, summaries }) => {
    summaries.forEach(({ city, dailySummary }) => {
      chartData.push({
        date,
        city,
        averageTemperature: dailySummary.averageTemperature,
        maximumTemperature: dailySummary.maximumTemperature,
        minimumTemperature: dailySummary.minimumTemperature,
      });
    });
  });

  const groupedData = chartData.reduce((acc, curr) => {
    const {
      date,
      city,
      averageTemperature,
      maximumTemperature,
      minimumTemperature,
    } = curr;
    const existingDate = acc.find((item) => item.date === date);

    if (existingDate) {
      existingDate.cities.push({
        city,
        averageTemperature,
        maximumTemperature,
        minimumTemperature,
      });
    } else {
      acc.push({
        date,
        cities: [
          {
            city,
            averageTemperature,
            maximumTemperature,
            minimumTemperature,
          },
        ],
      });
    }

    return acc;
  }, []);

  return (
    <div className="container mx-auto p-4 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Historical Trend&apos;s
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : historicalTrendsData.length === 0 ? (
        <p className="text-center">No data available</p>
      ) : (
        <div className="flex flex-col items-center">
          {groupedData.map((dataPoint, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mt-4 mb-4">
                {dataPoint.date}
              </h3>
              <BarChart
                width={800}
                height={300}
                data={dataPoint.cities}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageTemperature" fill="#4caf50" />
                <Bar dataKey="maximumTemperature" fill="#f44336" />
                <Bar dataKey="minimumTemperature" fill="#2196f3" />
              </BarChart>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricalTrends;
