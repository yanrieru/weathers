import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Soft3DBackground from "./components/Soft3dBackground";
import { getWeatherByCity, getWeatherByCoords, getForecastByCity } from "./lib/weather"; // ✅ tambahin getForecastByCity
import ForecastCard from "./components/ForecastCard";
import cloudIcon from "./assets/cloud.svg";

export default function App() {
  const [units, setUnits] = useState("metric"); // "metric" atau "imperial"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  // Ambil cuaca berdasar lokasi pengguna (jika izin diberikan)
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude, units);
          setWeather(data);
          setError("");
        } catch (e) {
          setError(e.message || "Gagal memuat cuaca lokasi.");
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false), // kalau ditolak, biarkan kosong
      { enableHighAccuracy: true, timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hanya saat mount

  async function handleSearch(city) {
    if (!city) return;
    setLoading(true);
    try {
      const data = await getWeatherByCity(city, units);
      const forecastData = await getForecastByCity(city, units); // ✅ ambil forecast juga
      setWeather(data);
      setForecast(forecastData);
      setError("");
    } catch (e) {
      setError(e.message || "Kota tidak ditemukan.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleUnits() {
    const next = units === "metric" ? "imperial" : "metric";
    setUnits(next);

    if (weather?.name) {
      handleSearch(weather.name);
    }
  }

  const hasWeather = !!weather;
  const Wrapper = hasWeather ? Soft3DBackground : "div";

  return (
    <Wrapper className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ease-in-out ${!hasWeather ? "bg-animated-gradient" : ""}`}>
      <div className={`w-full max-w-xl flex flex-col items-center gap-1 mt-[20px]`}>
        {!hasWeather && (
          <motion.div className="mt-0" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}>
            <img src={cloudIcon} alt="Weather Illustration" className="w-[300px] opacity-100" />
          </motion.div>
        )}

        <motion.h1 className="-mt-10 text-4xl font-bold text-gray-800 [text-shadow:0_1px_2px_rgba(0,0,0,30)]" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          Weather App
        </motion.h1>

        {/* Tagline */}
        <motion.p className="text-gray-600 text-ls mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
          Cari tahu cuaca terkini 🌤️
        </motion.p>

        <div className="flex items-center gap-1">
          <SearchBar onSearch={handleSearch} />
          <button onClick={toggleUnits}>{/* {units === "metric" ? "°C → °F" : "°F → °C"} */}</button>
        </div>

        {loading && <div className="animate-pulse text-slate-700">Memuat data cuaca...</div>}

        {error && <div className="text-red-600 font-medium">{error}</div>}

        {/* ✅ Render cuaca + forecast */}
        {hasWeather && (
          <>
            <WeatherCard data={weather} units={units} />
            <ForecastCard forecast={forecast} units={units} weather={weather} />
          </>
        )}

        <p className="text-xs text-slate-800 mt-[10px] mb-[40px]">Data by OpenWeatherMap</p>

        {/* ✅ Footer masuk di dalam kontainer */}
        <footer className="w-full border-t border-gray-300 mt-10 pt-4 text-center text-xs text-gray-600 mb-[2px]">
          Made with ❤️ by <span className="font-semibold text-gray-800 cursor-pointer transition-colors duration-300 hover:text-blue-500">AprlynCndrau</span>
        </footer>
      </div>
    </Wrapper>
  );
}
