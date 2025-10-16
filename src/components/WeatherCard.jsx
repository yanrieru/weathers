import { motion } from "framer-motion";
import { iconUrl } from "../lib/weather";

export default function WeatherCard({ data, units, t }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-xl rounded-3xl bg-white/20 border border-white/20 backdrop-blur-lg shadow-xl p-6 mx-auto mt-6"
    >
      {/* BAGIAN ATAS: Nama Kota & Kondisi */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">
            {data.name}, {data.country}
          </h2>
          <p className="text-slate-600 capitalize">{data.description}</p>
        </div>
        <img src={iconUrl(data.icon)} alt={data.description} className="h-16 w-16" loading="lazy" />
      </div>

      {/* --- Pembatas --- */}
      <hr className="my-4 border-slate-400" />

      {/* BAGIAN BAWAH: Suhu Utama & Detail */}
      <div className="flex items-end justify-between">
        {/* Kiri: Suhu */}
        <div className="flex items-center">
          <span className="text-6xl md:text-7xl font-extrabold leading-none">
            {Math.round(data.temp)}°{units === "metric" ? "C" : "F"}
          </span>
        </div>

        {/* Kanan: Detail Lainnya */}
        <div className="flex flex-col text-slate-700 text-sm leading-6">
          <div>
            {t.feelsLike} {Math.round(data.feelsLike)}°{units === "metric" ? "C" : "F"}
          </div>
          <div>
            {t.wind} {Math.round(data.wind)} {units === "metric" ? "m/s" : "mph"}
          </div>
          <div>
            {t.humidity} {data.humidity}%
          </div>
          <div>
            {t.sunrise} {data.sunrise} • {t.sunset} {data.sunset}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
