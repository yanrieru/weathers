import { motion } from "framer-motion";
import { iconUrl } from "../lib/weather";

export default function ForecastCard({ forecast, units, weather, t }) {
  if (!forecast || forecast.length === 0) return null;

  // Gunakan nama hari sesuai bahasa dari translations.js
  const days = t?.days || (t?.lang === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]);

  return (
    <div className="w-full max-w-3xl mt-6">
      {/* 📱 Mobile: scroll horizontal */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide sm:hidden">
        {forecast.map((day, i) => {
          const date = day?.date ? new Date(day.date) : null;
          const dayName = i === 0 ? t.today || "Hari ini" : days[date?.getDay() ?? 0];
          return (
            <motion.div key={i} whileHover={{ y: -6 }} className="min-w-[150px] bg-white/30 border border-white/20 backdrop-blur-md rounded-2xl p-6 shadow-md text-center">
              <p className="font-medium">{dayName}</p>
              <img src={iconUrl(day.icon)} alt={day.description} className="w-12 h-12 mx-auto" />
              <p className="text-2xl font-bold">
                {Math.round(day.temp)}°{units === "metric" ? "C" : "F"}
              </p>
              <p className="text-sm text-gray-600 capitalize">{day.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* 💻 Desktop: grid sejajar */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-4">
        {forecast.map((day, i) => {
          const date = day?.date ? new Date(day.date) : null;
          const dayName = i === 0 ? t.today || "Hari ini" : days[date?.getDay() ?? 0];
          return (
            <motion.div key={i} whileHover={{ y: -6 }} className="bg-white/30 border border-white/20 backdrop-blur-md rounded-2xl p-3 shadow-md text-center">
              <p className="font-medium">{dayName}</p>
              <img src={iconUrl(day.icon)} alt={day.description} className="w-12 h-12 mx-auto" />
              <p className="text-2xl font-bold">
                {Math.round(day.temp)}°{units === "metric" ? "C" : "F"}
              </p>
              <p className="text-xs text-gray-600 capitalize">{day.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
