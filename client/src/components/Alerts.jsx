import { useState, useEffect } from "react";
import axios from "axios";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/alerts");
        setAlerts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setError("Error fetching alerts");
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="container mx-auto p-4 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Triggered Alert&apos;s
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : alerts.length === 0 ? (
        <p className="text-center">No data available</p>
      ) : (
        <div className="h-96 overflow-scroll mt-10">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">City</th>
                <th className="border border-gray-300 p-2">Message</th>
                <th className="border border-gray-300 p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{alert.city}</td>
                  <td className="border border-gray-300 p-2">
                    {alert.message}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {alert.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Alerts;
