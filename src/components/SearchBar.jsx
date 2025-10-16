import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchBar({ onSearch, placeholder, buttonLabel, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <motion.form
      onSubmit={(e) => { e.preventDefault(); onSearch(value.trim()); }}
      className="flex w-full max-w-xl gap-2 rounded-full px-4 py-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="flex items-center max-w-md mx-auto mt-0 bg-white/20 backdrop-blur-lg rounded-full shadow-lg overflow-hidden">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || "Cari kota, wilayah, dunia..."}
          className="flex-1 px-4 py-2 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-full transition"
        >
          {buttonLabel || "Cari"}
        </button>
      </div>
    </motion.form>
  );
}
