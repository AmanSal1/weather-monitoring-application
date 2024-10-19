import Alerts from "./components/Alerts";
import HistoricalTrends from "./components/HistoricalTrends";
import WeatherSummary from "./components/WeatherSummary";

function App() {
  return (
    <div>
      <div className="font-bold text-center text-3xl mt-4 mb-10">
        Weather Monitoring System
      </div>
      <WeatherSummary />
      <HistoricalTrends />
      <Alerts />
    </div>
  );
}

export default App;
