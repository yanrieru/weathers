import { motion } from "framer-motion";
import { iconUrl } from "../lib/weather";

export default function ForecastCard({ forecast, units, weather }) {
  if (!forecast || forecast.length === 0) return null;

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="w-full max-w-3xl mt-6">
      {/* 📱 Mobile: scroll horizontal */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide sm:hidden">
        {forecast.map((day, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="min-w-[150px] bg-white/30 backdrop-blur-md rounded-2xl p-6 shadow-md text-center"
          >
            <p className="font-medium">
              {i === 0 ? "Hari ini" : days[new Date(day.date).getDay()]}
            </p>
            <img
              src={iconUrl(day.icon)}
              alt={day.description}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-2xl font-bold">
              {Math.round(day.temp)}°{units === "metric" ? "C" : "F"}
            </p>
            <p className="text-sm text-gray-600 capitalize">{day.description}</p>
          </motion.div>
        ))}
      </div>

      {/* 💻 Desktop: grid sejajar */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-4">
        {forecast.map((day, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="bg-white/30 backdrop-blur-md rounded-2xl p-3 shadow-md text-center"
          >
            <p className="font-medium">
              {i === 0 ? "Hari ini" : days[new Date(day.date).getDay()]}
            </p>
            <img
              src={iconUrl(day.icon)}
              alt={day.description}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-2xl font-bold">
              {Math.round(day.temp)}°{units === "metric" ? "C" : "F"}
            </p>
            <p className="text-xs text-gray-600 capitalize">{day.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

