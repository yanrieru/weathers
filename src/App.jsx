import { useEffect, useState } from "react";
import { TiArrowBack } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Soft3DBackground from "./components/Soft3dBackground";
import ForecastCard from "./components/ForecastCard";
import { translations } from "./lib/translations";
import { getWeatherByCity, getWeatherByCoords, getForecastByCity } from "./lib/weather";
import cloudIcon from "./assets/cloud.svg";

export default function App() {
  const [units, setUnits] = useState("metric");
  const [lang, setLang] = useState("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const t = translations[lang];

  // 📍 Ambil cuaca berdasar lokasi pengguna
  useEffect(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude, units, lang);
          setWeather(data);
          setError("");
        } catch (e) {
          setError(e.message || (lang === "id" ? "Gagal memuat cuaca lokasi." : "Failed to load weather data."));
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🌐 Refresh data otomatis saat bahasa berubah
  useEffect(() => {
    if (weather?.name) {
      handleSearch(weather.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function handleSearch(city) {
    if (!city) return;
    setLoading(true);
    try {
      const data = await getWeatherByCity(city, units, lang);
      const forecastData = await getForecastByCity(city, units, lang);
      setWeather(data);
      setForecast(forecastData);
      setError("");
    } catch (e) {
      setError(e.message || (lang === "id" ? "Kota tidak ditemukan." : "City not found."));
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleUnits() {
    const next = units === "metric" ? "imperial" : "metric";
    setUnits(next);
    if (weather?.name) handleSearch(weather.name);
  }

  function handleBack() {
    setWeather(null);
    setForecast([]);
  }

  const hasWeather = !!weather;
  const Wrapper = hasWeather ? Soft3DBackground : "div";

  // 🌍 Toggle bahasa
  const toggleLang = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  return (
    <Wrapper className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ease-in-out ${!hasWeather ? "bg-animated-gradient" : ""}`}>
      {/* 🌐 Tombol toggle bahasa */}
      <div className="absolute top-4 right-4">
        <button onClick={toggleLang} className="px-3 py-2 bg-white/60 backdrop-blur rounded-xl shadow text-sm font-medium hover:scale-95 transition">
          {lang === "id" ? "🌍 EN" : "🇮🇩 ID"}
        </button>
      </div>

      <div className={`w-full max-w-xl flex flex-col items-center gap-1 mt-[20px]`}>
        {!hasWeather && (
          <motion.div key="weather-illustration" className="mt-0" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}>
            <img src={cloudIcon} alt="Weather Illustration" className="w-[300px] opacity-100" />
          </motion.div>
        )}

        <motion.h1 className="-mt-10 text-4xl font-bold text-gray-800 [text-shadow:0_1px_2px_rgba(0,0,0,30)]" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          Weather App
        </motion.h1>

        {/* ✨ Tagline dengan animasi smooth */}
        <AnimatePresence mode="wait">
          <motion.p key={lang} className="text-gray-600 text-ls mb-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.4 }}>
            {t.tagline}
          </motion.p>
        </AnimatePresence>

        {/* 🔍 Search bar */}
        <div className="flex items-center gap-1">
          <SearchBar onSearch={handleSearch} placeholder={t.searchPlaceholder} buttonLabel={t.searchButton} />
          <button onClick={toggleUnits}></button>
        </div>

        {loading && <div className="animate-pulse text-slate-700">{lang === "id" ? "Memuat data cuaca..." : "Loading weather data..."}</div>}

        {error && <div className="text-red-600 font-medium">{error}</div>}

        {/* 🌤️ Konten utama (Weather + Forecast) */}
        {hasWeather && (
          <>
            {/* 🔙 Tombol kembali */}
            <motion.button onClick={handleBack} className="absolute top-4 left-4 bg-white/50 backdrop-blur px-3 py-2 rounded-xl shadow hover:scale-95 transition flex items-center gap-2" whileTap={{ scale: 0.95 }}>
              <TiArrowBack size={20} className="text-slate-700" />
              <span className="font-medium text-slate-800 hidden sm:inline">{t.back}</span>
            </motion.button>

            {/* 🌡️ Cuaca sekarang */}
            <WeatherCard data={weather} units={units} t={t} />

            {/* 📅 Prakiraan 5 hari */}
            <ForecastCard forecast={forecast} units={units} weather={weather} t={t} />
          </>
        )}

        {/* 🪶 Credit sumber data */}
        <AnimatePresence mode="wait">
          <motion.p key={lang + "-source"} className="text-xs text-slate-800 mt-[10px] mb-[40px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {t.dataSource}
          </motion.p>
        </AnimatePresence>
      </div>
    </Wrapper>
  );
}
