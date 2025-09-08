const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_BASE = "https://api.openweathermap.org/data/2.5";

/**
 * Format waktu lokal (HH:MM)
 */
function formatLocalTime(ts, tzOffsetSeconds) {
  if (!ts || tzOffsetSeconds === undefined) return "--:--";
  const ms = (ts + tzOffsetSeconds) * 1000;
  const d = new Date(ms);
  return d.toUTCString().split(" ")[4].slice(0, 5); // HH:MM
}

/**
 * Mapping data cuaca saat ini
 */
function mapWeather(json) {
  const w = json.weather?.[0] ?? {};
  return {
    name: json.name,
    country: json.sys?.country,
    temp: Math.round(json.main?.temp),
    feelsLike: Math.round(json.main?.feels_like),
    humidity: json.main?.humidity,
    wind: Math.round((json.wind?.speed ?? 0) * 10) / 10,
    description: w.description,
    icon: w.icon, // ex: "10d"
    sunrise: formatLocalTime(json.sys?.sunrise, json.timezone),
    sunset: formatLocalTime(json.sys?.sunset, json.timezone),
  };
}

/**
 * Mapping data forecast 5 hari
 */
function mapForecast(json) {
  if (!json.list) return [];

  // Ambil 1 data per hari (jam 12:00 siang)
  const daily = json.list.filter((item) => item.dt_txt.includes("12:00:00"));

  return daily.map((item) => {
    const w = item.weather?.[0] ?? {};
    return {
      date: item.dt_txt, // contoh: "2025-09-01 12:00:00"
      temp: Math.round(item.main?.temp),
      description: w.description,
      icon: w.icon,
    };
  });
}

/**
 * Ambil cuaca berdasarkan nama kota
 */
export async function getWeatherByCity(city, units = "metric", lang = "id") {
  if (!API_KEY) throw new Error("API key belum diset di .env");
  const url = `${API_BASE}/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=${units}&lang=${lang}`;

  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.json().catch(() => ({}));
    throw new Error(t.message || `Request gagal (${res.status})`);
  }

  const json = await res.json();
  return mapWeather(json);
}

/**
 * Ambil cuaca berdasarkan koordinat (GPS)
 */
export async function getWeatherByCoords(lat, lon, units = "metric", lang = "id") {
  if (!API_KEY) throw new Error("API key belum diset di .env");
  const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}&lang=${lang}`;

  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.json().catch(() => ({}));
    throw new Error(t.message || `Request gagal (${res.status})`);
  }

  const json = await res.json();
  return mapWeather(json);
}

/**
 * Ambil prakiraan 5 hari (tiap hari jam 12:00)
 */
export async function getForecastByCity(city, units = "metric", lang = "id") {
  if (!API_KEY) throw new Error("API key belum diset di .env");
  const url = `${API_BASE}/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=${units}&lang=${lang}`;

  const res = await fetch(url);
  if (!res.ok) {
    const t = await res.json().catch(() => ({}));
    throw new Error(t.message || `Request gagal (${res.status})`);
  }

  const json = await res.json();
  return mapForecast(json);
}

/**
 * Helper buat URL icon
 */
export function iconUrl(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}
